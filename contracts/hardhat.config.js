require('@nomicfoundation/hardhat-toolbox');

const PRIVATE_KEY = process.env.PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    campTestnet: {
      url: 'https://rpc.basecamp.t.raas.gelato.cloud',
      chainId: 123420001114,
      accounts: [PRIVATE_KEY],
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
  etherscan: {
    apiKey: {
      campTestnet: 'no-api-key-needed',
    },
    customChains: [
      {
        network: 'campTestnet',
        chainId: 123420001114,
        urls: {
          apiURL: 'https://basecamp.cloud.blockscout.com/api',
          browserURL: 'https://basecamp.cloud.blockscout.com',
        },
      },
    ],
  },
};