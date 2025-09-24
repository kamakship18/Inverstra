const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting PredictionDAO deployment...");

  // Get the contract factory
  const PredictionDAO = await ethers.getContractFactory("PredictionDAO");

  // Deploy the contract
  console.log("📦 Deploying PredictionDAO contract...");
  const predictionDAO = await PredictionDAO.deploy();

  // Wait for deployment to complete
  await predictionDAO.waitForDeployment();

  const contractAddress = await predictionDAO.getAddress();
  console.log("✅ PredictionDAO deployed to:", contractAddress);

  // Get the owner address
  const owner = await predictionDAO.owner();
  console.log("👤 Contract owner:", owner);

  // Add the owner as a member (they're automatically added in constructor)
  console.log("✅ Owner is automatically a DAO member");

  // Display contract info
  console.log("\n📋 Contract Information:");
  console.log("Address:", contractAddress);
  console.log("Owner:", owner);
  console.log("Voting Threshold:", await predictionDAO.VOTING_THRESHOLD(), "%");
  console.log("Min Voting Period:", await predictionDAO.MIN_VOTING_PERIOD(), "seconds");
  console.log("Max Voting Period:", await predictionDAO.MAX_VOTING_PERIOD(), "seconds");

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    owner,
    votingThreshold: (await predictionDAO.VOTING_THRESHOLD()).toString(),
    minVotingPeriod: (await predictionDAO.MIN_VOTING_PERIOD()).toString(),
    maxVotingPeriod: (await predictionDAO.MAX_VOTING_PERIOD()).toString(),
    deployedAt: new Date().toISOString(),
    network: "localhost"
  };

  console.log("\n💾 Deployment info saved to deployment-info.json");
  
  // You can save this to a file if needed
  const fs = require('fs');
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Update the contract address in frontend/contract/daoContractAddress.js");
  console.log("2. Add DAO members using the addMember function");
  console.log("3. Test the contract functionality");
  console.log("4. Start creating and voting on predictions!");

  return contractAddress;
}

// Execute the deployment
main()
  .then((address) => {
    console.log(`\n🔗 Contract deployed at: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
