import React from 'react';
import Web3 from 'web3';

interface IWalletContext {
  web3: Web3 | null;
  selectedAddress: string | null;
  setWallet: (web3: Web3 | null, selectedAddress: string | null) => void;
  setBalance: (balance: string | null) => void; // Ajouter cette ligne pour définir la fonction setBalance
}

export const WalletContext = React.createContext<IWalletContext | null>(null);
