const hre = require('hardhat');

async function main() {
  console.log('Deploying contracts to Camp Network...');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(balance), 'CAMP');

  console.log('\n--- Deploying HealthRecords ---');
  const HealthRecords = await hre.ethers.getContractFactory('HealthRecords');
  const healthRecords = await HealthRecords.deploy();
  await healthRecords.waitForDeployment();
  const healthRecordsAddress = await healthRecords.getAddress();
  console.log('HealthRecords deployed to:', healthRecordsAddress);

  console.log('\n--- Deploying AdherenceToken ---');
  const AdherenceToken = await hre.ethers.getContractFactory('AdherenceToken');
  const adherenceToken = await AdherenceToken.deploy(healthRecordsAddress);
  await adherenceToken.waitForDeployment();
  const adherenceTokenAddress = await adherenceToken.getAddress();
  console.log('AdherenceToken deployed to:', adherenceTokenAddress);

  console.log('\n--- Deployment Summary ---');
  console.log('HealthRecords:', healthRecordsAddress);
  console.log('AdherenceToken:', adherenceTokenAddress);
  console.log('\nVerify on BlockScout:');
  console.log(`https://basecamp.cloud.blockscout.com/address/${healthRecordsAddress}`);
  console.log(`https://basecamp.cloud.blockscout.com/address/${adherenceTokenAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });