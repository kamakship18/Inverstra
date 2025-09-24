// PredictionDAO Contract Address
// Get from environment variable or use fallback
const DAO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "0xd9145CCE52D386f254917e481eB44e9943F39138";

export const predictionDAOContractAddress = DAO_CONTRACT_ADDRESS;
export const LOCAL_DAO_CONTRACT_ADDRESS = DAO_CONTRACT_ADDRESS;

// Network configurations
export const DAO_CONTRACT_CONFIG = {
  // Local development
  localhost: {
    address: DAO_CONTRACT_ADDRESS,
    chainId: 1337,
    name: "Localhost"
  },
  // Add other networks as needed
  sepolia: {
    address: "0x0000000000000000000000000000000000000000", // Update when deployed
    chainId: 11155111,
    name: "Sepolia Testnet"
  },
  // Mainnet (when ready)
  mainnet: {
    address: "0x0000000000000000000000000000000000000000", // Update when deployed
    chainId: 1,
    name: "Ethereum Mainnet"
  }
};
