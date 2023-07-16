import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, sepolia, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, goerli, hardhat, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import App from './App';
import { localhost} from 'viem/chains';
import detectEthereumProvider from '@metamask/detect-provider';

const startApp = async () => {
  const provider = await detectEthereumProvider();
  if (provider) {
    // MetaMask is available
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [
        mainnet,
        sepolia
      ],
      [publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: 'ArtxX',
      projectId: '77ae7eaab14ef71d0e24d1003b8e81d5',
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
