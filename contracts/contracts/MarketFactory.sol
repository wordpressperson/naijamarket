// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./PredictionMarket.sol";

contract MarketFactory {
    address public owner;
    address[] public markets;

    // Fees in basis points (100 = 1%)
    uint256 public feePercentage = 100;
    address public feeRecipient;

    event MarketCreated(
        address indexed marketAddress,
        string question,
        string imageUrl,
        string category,
        uint256 endTime
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        feeRecipient = msg.sender;
    }

    function setFeePercentage(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee too high"); // Max 10%
        feePercentage = _feePercentage;
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Invalid address");
        feeRecipient = _feeRecipient;
    }

    function createMarket(
        address _collateralToken,
        address _resolver,
        string memory _question,
        string memory _imageUrl,
        string memory _category,
        uint256 _endTime
    ) external onlyOwner returns (address) {
        PredictionMarket newMarket = new PredictionMarket(
            _collateralToken,
            _resolver,
            _question,
            _imageUrl,
            _category,
            _endTime,
            feePercentage,
            feeRecipient
        );

        markets.push(address(newMarket));

        emit MarketCreated(
            address(newMarket),
            _question,
            _imageUrl,
            _category,
            _endTime
        );

        return address(newMarket);
    }

    function getMarkets() external view returns (address[] memory) {
        return markets;
    }

    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }
}
