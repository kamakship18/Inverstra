# PredictionDAO Smart Contract

This directory contains the smart contract for the PredictionDAO system.

## Contract Overview

The `PredictionDAO.sol` contract implements a decentralized autonomous organization for prediction governance with the following features:

- **Prediction Creation**: Members can create predictions with titles, descriptions, and categories
- **Community Voting**: All members can vote Yes/No on predictions
- **70% Approval Threshold**: Predictions need 70% community approval to be featured
- **Voting Periods**: Configurable voting periods from 1-7 days
- **Member Management**: Owner can add/remove DAO members

## Deployment Instructions

### Option 1: Using Remix IDE (Recommended)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `PredictionDAO.sol`
3. Copy the contract code from `contracts/PredictionDAO.sol`
4. Install OpenZeppelin contracts:
   - Go to the "Solidity Compiler" tab
   - Click "Advanced Configurations"
   - Add `@openzeppelin/contracts=^5.0.0` to the remappings
5. Compile the contract
6. Deploy to your preferred network (localhost, Sepolia, etc.)
7. Copy the deployed contract address
8. Update the contract address in `frontend/contract/daoContractAddress.js`

### Option 2: Using Hardhat (Local Development)

1. Install dependencies:
   ```bash
   cd contracts
   npm install
   ```

2. Start a local Hardhat node:
   ```bash
   npx hardhat node
   ```

3. Deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

4. Update the contract address in `frontend/contract/daoContractAddress.js`

## Contract Functions

### Core Functions
- `createPrediction(title, description, category, votingPeriod)` - Create a new prediction
- `vote(predictionId, support)` - Vote Yes/No on a prediction
- `finalizePrediction(predictionId)` - Manually finalize a prediction after voting period

### View Functions
- `getActivePredictions()` - Get all active predictions
- `getApprovedPredictions()` - Get all approved predictions (70%+ votes)
- `getPrediction(predictionId)` - Get specific prediction details
- `getVotingStats(predictionId)` - Get voting statistics for a prediction
- `hasUserVoted(predictionId, userAddress)` - Check if user has voted

### Admin Functions
- `addMember(address)` - Add a new DAO member
- `removeMember(address)` - Remove a DAO member

## Integration

After deployment, update the contract address in:
- `frontend/contract/daoContractAddress.js`
- The backend will automatically use the updated address

## Testing

The contract includes comprehensive functionality for:
- Creating predictions
- Voting on predictions
- Managing DAO members
- Retrieving prediction data

## Security Features

- ReentrancyGuard protection
- Owner-only member management
- Input validation for prediction data
- Time-based voting periods
- Automatic approval threshold checking
