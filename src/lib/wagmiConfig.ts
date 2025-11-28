import { createConfig, http } from 'wagmi';
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import { campTestnet } from '@/config/campNetwork';

export const wagmiConfig = createConfig({
  chains: [campTestnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'MEDPRO',
      },
    }),
    injected({
      target: 'metaMask',
    }),
    injected({
      target() {
        return {
          id: 'phantom',
          name: 'Phantom',
          provider: typeof window !== 'undefined' ? (window as any).phantom?.ethereum : undefined,
        };
      },
    }),
    injected({
      target() {
        return {
          id: 'okx',
          name: 'OKX Wallet',
          provider: typeof window !== 'undefined' ? (window as any).okxwallet : undefined,
        };
      },
    }),
    coinbaseWallet({
      appName: 'MEDPRO',
    }),
    injected(),
  ],
  transports: {
    [campTestnet.id]: http(),
  },
});
