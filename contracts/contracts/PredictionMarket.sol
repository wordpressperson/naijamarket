// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PredictionMarket is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable collateralToken;
    address public immutable factory;
    address public resolver;

    string public question;
    string public imageUrl;
    string public category;
    uint256 public endTime;
    uint256 public feePercentage;
    address public feeRecipient;

    uint256 public totalYesPool;
    uint256 public totalNoPool;

    mapping(address => uint256) public yesShares;
    mapping(address => uint256) public noShares;

    enum MarketState { Active, Resolved, Cancelled }
    MarketState public state;

    enum Outcome { Unresolved, Yes, No }
    Outcome public finalOutcome;

    event SharesBought(address indexed user, bool isYes, uint256 amount);
    event MarketResolved(Outcome outcome);
    event MarketCancelled();
    event WinningsClaimed(address indexed user, uint256 amount, uint256 fee);

    modifier onlyResolver() {
        require(msg.sender == resolver, "Only resolver");
        _;
    }

    constructor(
        address _collateralToken,
        address _resolver,
        string memory _question,
        string memory _imageUrl,
        string memory _category,
        uint256 _endTime,
        uint256 _feePercentage,
        address _feeRecipient
    ) {
        require(_collateralToken != address(0), "Invalid token");
        require(_resolver != address(0), "Invalid resolver");
        require(_endTime > block.timestamp, "End time must be in future");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        factory = msg.sender;
        collateralToken = IERC20(_collateralToken);
        resolver = _resolver;
        question = _question;
        imageUrl = _imageUrl;
        category = _category;
        endTime = _endTime;
        feePercentage = _feePercentage;
        feeRecipient = _feeRecipient;
        state = MarketState.Active;
    }

    function buyShares(bool isYes, uint256 amount) external nonReentrant {
        require(state == MarketState.Active, "Market not active");
        require(block.timestamp < endTime, "Betting has ended");
        require(amount > 0, "Amount must be > 0");

        collateralToken.safeTransferFrom(msg.sender, address(this), amount);

        if (isYes) {
            yesShares[msg.sender] += amount;
            totalYesPool += amount;
        } else {
            noShares[msg.sender] += amount;
            totalNoPool += amount;
        }

        emit SharesBought(msg.sender, isYes, amount);
    }

    function resolveMarket(Outcome _outcome) external onlyResolver {
        require(state == MarketState.Active, "Market not active");
        require(block.timestamp >= endTime, "Market hasn't ended yet");
        require(_outcome == Outcome.Yes || _outcome == Outcome.No, "Invalid outcome");

        state = MarketState.Resolved;
        finalOutcome = _outcome;

        emit MarketResolved(_outcome);
    }

    function cancelMarket() external onlyResolver {
        require(state == MarketState.Active, "Market not active");
        state = MarketState.Cancelled;
        emit MarketCancelled();
    }

    function claimWinnings() external nonReentrant {
        require(state == MarketState.Resolved || state == MarketState.Cancelled, "Market not ended");

        uint256 payout = 0;
        uint256 fee = 0;

        if (state == MarketState.Cancelled) {
            uint256 userYesShares = yesShares[msg.sender];
            uint256 userNoShares = noShares[msg.sender];
            
            yesShares[msg.sender] = 0;
            noShares[msg.sender] = 0;
            
            payout = userYesShares + userNoShares;
        } else if (finalOutcome == Outcome.Yes) {
            uint256 userShares = yesShares[msg.sender];
            require(userShares > 0, "No winning shares");
            
            yesShares[msg.sender] = 0; // Prevent re-entry

            if (totalYesPool > 0) {
                uint256 totalPool = totalYesPool + totalNoPool;
                uint256 totalPayout = (userShares * totalPool) / totalYesPool;
                uint256 principal = userShares;
                
                if (totalPayout > principal) {
                    uint256 profit = totalPayout - principal;
                    fee = (profit * feePercentage) / 10000;
                    payout = totalPayout - fee;
                } else {
                    payout = totalPayout;
                }
            }
        } else if (finalOutcome == Outcome.No) {
            uint256 userShares = noShares[msg.sender];
            require(userShares > 0, "No winning shares");

            noShares[msg.sender] = 0; // Prevent re-entry

            if (totalNoPool > 0) {
                uint256 totalPool = totalYesPool + totalNoPool;
                uint256 totalPayout = (userShares * totalPool) / totalNoPool;
                uint256 principal = userShares;
                
                if (totalPayout > principal) {
                    uint256 profit = totalPayout - principal;
                    fee = (profit * feePercentage) / 10000;
                    payout = totalPayout - fee;
                } else {
                    payout = totalPayout;
                }
            }
        }

        require(payout > 0, "Nothing to claim");
        
        if (fee > 0) {
            collateralToken.safeTransfer(feeRecipient, fee);
        }
        
        collateralToken.safeTransfer(msg.sender, payout);

        emit WinningsClaimed(msg.sender, payout, fee);
    }

    struct MarketInfo {
        string question;
        string imageUrl;
        string category;
        uint256 endTime;
        uint256 totalYesPool;
        uint256 totalNoPool;
        MarketState state;
        Outcome finalOutcome;
    }

    function getMarketInfo() external view returns (MarketInfo memory) {
        return MarketInfo(
            question,
            imageUrl,
            category,
            endTime,
            totalYesPool,
            totalNoPool,
            state,
            finalOutcome
        );
    }
}
