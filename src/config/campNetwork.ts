import { defineChain } from 'viem';

export const campTestnet = defineChain({
  id: 123420001114,
  name: 'Camp Network Testnet',
  network: 'basecamp',
  nativeCurrency: {
    decimals: 18,
    name: 'CAMP',
    symbol: 'CAMP',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.basecamp.t.raas.gelato.cloud'],
      webSocket: ['wss://rpc.basecamp.t.raas.gelato.cloud'],
    },
    public: {
      http: ['https://rpc-campnetwork.xyz'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Camp Network Explorer', 
      url: 'https://basecamp.cloud.blockscout.com' 
    },
  },
  testnet: true,
});

export const MEDPRO_CONTRACT_ADDRESS = '0x37a487D193F7717206762Ec0B3c247A2C8C64b15' as const;
