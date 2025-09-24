#!/usr/bin/env node

/**
 * Script to update the DAO contract address after deployment
 * Usage: node update-contract-address.js <contract-address> [network]
 */

const fs = require('fs');
const path = require('path');

const contractAddress = process.argv[2];
const network = process.argv[3] || 'localhost';

if (!contractAddress) {
  console.error('❌ Please provide a contract address');
  console.log('Usage: node update-contract-address.js <contract-address> [network]');
  console.log('Example: node update-contract-address.js 0x1234...abcd localhost');
  process.exit(1);
}

// Validate address format
if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
  console.error('❌ Invalid contract address format');
  process.exit(1);
}

const contractAddressFile = path.join(__dirname, 'frontend/contract/daoContractAddress.js');

try {
  // Read the current file
  let content = fs.readFileSync(contractAddressFile, 'utf8');
  
  // Update the contract address
  content = content.replace(
    /export const predictionDAOContractAddress = "[^"]*";/,
    `export const predictionDAOContractAddress = "${contractAddress}";`
  );
  
  // Update the network config
  const networkConfigs = {
    localhost: {
      address: contractAddress,
      chainId: 1337,
      name: "Localhost"
    },
    sepolia: {
      address: contractAddress,
      chainId: 11155111,
      name: "Sepolia Testnet"
    },
    mainnet: {
      address: contractAddress,
      chainId: 1,
      name: "Ethereum Mainnet"
    }
  };
  
  // Update the specific network config
  if (networkConfigs[network]) {
    const config = networkConfigs[network];
    content = content.replace(
      new RegExp(`(${network}:\\s*{[^}]*address:\\s*")[^"]*(")`),
      `$1${contractAddress}$2`
    );
  }
  
  // Write the updated file
  fs.writeFileSync(contractAddressFile, content);
  
  console.log('✅ Contract address updated successfully!');
  console.log(`📍 Network: ${network}`);
  console.log(`🔗 Address: ${contractAddress}`);
  console.log(`📁 File: ${contractAddressFile}`);
  console.log('');
  console.log('🚀 Next steps:');
  console.log('1. Restart your frontend development server');
  console.log('2. Restart your backend server');
  console.log('3. Test the DAO functionality');
  
} catch (error) {
  console.error('❌ Error updating contract address:', error.message);
  process.exit(1);
}
