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

// Normal wallet address to receive CAMP payments (not the HealthRecords contract)
// TODO: Replace this with your actual wallet address
export const MEDPRO_PAYMENT_ADDRESS = '0xYourWalletAddressHere' as const;
