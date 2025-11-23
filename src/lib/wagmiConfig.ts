import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { campTestnet } from '@/config/campNetwork';

export const wagmiConfig = createConfig({
  chains: [campTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [campTestnet.id]: http(),
  },
});
