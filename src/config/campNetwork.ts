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

// Wallet address to receive CAMP payments for premium subscriptions
export const MEDPRO_PAYMENT_ADDRESS = '0xadc1866530B221AD80D77ba97EFa6888C1277418' as const;

// HealthRecords contract - deployed and ready for payments
export const MEDPRO_CONTRACT_ADDRESS = '0x6fe26955bd2b985D522fDfb8f6fbD227Bb74104e' as const;
