import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    sepolia,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}
      
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

