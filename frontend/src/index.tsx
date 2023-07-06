import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli, hardhat, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';
import { localhost } from 'viem/chains';
import detectEthereumProvider from '@metamask/detect-provider';

const startApp = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    // MetaMask is available
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [
        mainnet,
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
          <RainbowKitProvider chains={chains}>
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
      </React.StrictMode>
    );
  } else {
    // MetaMask is not available, do not render the app
    console.error('Please install MetaMask.');
  }
};

startApp();
