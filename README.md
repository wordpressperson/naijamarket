# NaijaMarket - Technical Documentation

This document provides an overview of the current technical state of the NaijaMarket prediction platform, including the technology stack, project architecture, and the features implemented so far.

## 1. Overview & Technology Stack

NaijaMarket is a decentralized prediction market tailored for the Nigerian user base. It features a parimutuel betting system, where users can bet on binary (Yes/No) outcomes using an ERC20 token as collateral.

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 14 (App Router)
- **UI Library**: [React](https://react.dev/) 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `clsx` and `tailwind-merge`
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Web3 Integration
- **Wallet Connectivity**: [RainbowKit](https://www.rainbowkit.com/)
- **Ethereum React Hooks**: [Wagmi](https://wagmi.sh/)
- **Ethereum Interactions**: [Viem](https://viem.sh/)

### Smart Contracts
- **Language**: Solidity `^0.8.24`
- **Development Environment**: [Hardhat](https://hardhat.org/)
- **Libraries**: [OpenZeppelin Contracts](https://www.openzeppelin.com/contracts) (IERC20, SafeERC20, ReentrancyGuard)

---

## 2. Project Architecture & Directory Structure

The repository is structured as a monorepo containing both the frontend application and the backend smart contracts.

```text
polymarket-app/
├── contracts/               # Hardhat project for Smart Contracts
│   ├── contracts/           # Solidity source files
│   ├── scripts/             # Deployment scripts
│   └── test/                # Smart contract tests
└── src/                     # Next.js Frontend Application
    ├── app/                 # App Router pages and layouts
    └── components/          # Reusable React components
```

---

## 3. Smart Contracts Implementation

The core logic of the prediction market is implemented using robust, security-focused Solidity contracts.

### `MarketFactory.sol`
Acts as the central registry and deployer for all prediction markets.
- **Market Creation**: Allows the contract owner to deploy new `PredictionMarket` instances.
- **Fee Management**: Configures a global platform fee percentage (max 10%) and designates a fee recipient address.
- **Market Tracking**: Maintains an array of all deployed market addresses.

### `PredictionMarket.sol`
Represents an individual binary prediction market (Yes/No).
- **Parimutuel Betting System**: Users buy shares for `Yes` or `No` outcomes using a specified ERC20 collateral token. The odds and payouts are dynamically determined by the total liquidity in each pool.
- **Market States**: `Active`, `Resolved`, and `Cancelled`.
- **Resolution**: A designated `resolver` address is authorized to resolve the market with a final outcome once the `endTime` is reached.
- **Claiming Winnings**: Winning users can claim their payouts, which are calculated proportionally to their pool share. Platform fees are deducted automatically from the profits (principal is not taxed).
- **Security**: Utilizes OpenZeppelin's `ReentrancyGuard` for functions like `buyShares` and `claimWinnings` to prevent reentrancy attacks, and `SafeERC20` for secure token transfers.

### `MockERC20.sol`
A standard ERC20 token used for local testing and development to simulate stablecoin collateral.

---

## 4. Frontend Implementation

The frontend is built to be highly responsive, modern, and user-friendly, catering to both crypto-native and non-crypto-native users.

### Pages (`src/app/`)
- **`/` (Home)**: The main landing page, displaying trending markets and an overview of available categories.
- **`/admin`**: A secure, wallet-authenticated dashboard for the platform owner to create and manage markets (integrating with `MarketFactory`).
- **`/market/[id]`**: The detailed view for a specific market, showing the question, charts, and the trading terminal.
- **`/[category]`**: Dynamic routes for filtering markets by categories (e.g., Politics, Sports, Entertainment).

### Components (`src/components/`)
- **`ui/` (Layout & Shell)**:
  - `Navbar.tsx`: Top navigation bar containing the wallet connect button and platform branding.
  - `Sidebar.tsx`: Side navigation for category filtering and user settings.
- **`market/` (Core Features)**:
  - `MarketCard.tsx`: A summary card displaying market question, image, category, and current odds.
  - `TradingTerminal.tsx`: The interface where users input their wager amounts, select Yes/No, and interact with the smart contract to buy shares.
  - `MarketChart.tsx`: A dynamic line/area chart (using Recharts) to visualize the odds probability or volume over time.
  - `TrendingBanner.tsx`: A highlighted section for the most active or newly created markets.
  - `MarketGrid.tsx`: A responsive grid layout component for organizing multiple `MarketCard` instances.
- **`providers/`**: Context providers including RainbowKit/Wagmi configuration for wallet state management.

---

## 5. Next Steps / Pending Work

While the core infrastructure is established, the following areas represent potential next steps based on the current implementation state:
1. **Smart Contract Deployment**: Deploy the finalized `MarketFactory` and `PredictionMarket` contracts to the Polygon Mainnet (or testnet like Amoy for final validation).
2. **Environment Configuration**: Update the frontend `.env` files with the deployed contract addresses and active RPC endpoints.
3. **Frontend Integration**: Finalize the connection between the `TradingTerminal` and the deployed smart contracts using `wagmi` hooks to read real-time data (`totalYesPool`, `totalNoPool`) and execute `buyShares` transactions.
4. **Data Indexing**: Consider implementing a backend indexer (like The Graph or an off-chain API) to efficiently query historical market data and user portfolios without relying solely on RPC calls.
