import { createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { campTestnet } from '@/config/campNetwork';

export const wagmiConfig = createConfig({
  chains: [campTestnet],
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: 'ba1146c85ab32c5ceea9cdefdcf5e187',
      metadata: {
        name: 'MEDPRO',
        description: 'Decentralized Health Management Platform',
        url: 'https://camedpro.vercel.app',
        icons: ['https://medpro.app/medpro-logo.png']
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [campTestnet.id]: http(),
  },
});
