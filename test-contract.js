const { ethers } = require('ethers');

// Test script to verify contract connection
async function testContract() {
  try {
    console.log('🔍 Testing contract connection...');
    
    // Connect to localhost (you might need to change this to your network)
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    
    // Contract address
    const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
    
    // Simple ABI with just basic functions
    const simpleABI = [
      "function owner() view returns (address)",
      "function nextPredictionId() view returns (uint256)",
      "function VOTING_THRESHOLD() view returns (uint256)"
    ];
    
    const contract = new ethers.Contract(contractAddress, simpleABI, provider);
    
    console.log('📡 Testing basic contract functions...');
    
    // Test owner
    try {
      const owner = await contract.owner();
      console.log('✅ Owner:', owner);
    } catch (error) {
      console.log('❌ Owner function error:', error.message);
    }
    
    // Test nextPredictionId
    try {
      const nextId = await contract.nextPredictionId();
      console.log('✅ Next Prediction ID:', nextId.toString());
    } catch (error) {
      console.log('❌ NextPredictionId function error:', error.message);
    }
    
    // Test VOTING_THRESHOLD
    try {
      const threshold = await contract.VOTING_THRESHOLD();
      console.log('✅ Voting Threshold:', threshold.toString());
    } catch (error) {
      console.log('❌ VOTING_THRESHOLD function error:', error.message);
    }
    
    console.log('🎉 Contract test completed!');
    
  } catch (error) {
    console.error('❌ Contract test failed:', error.message);
  }
}

testContract();
