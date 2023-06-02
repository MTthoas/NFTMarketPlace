import React, { createContext, useState, PropsWithChildren } from 'react';
import { ethers } from 'ethers';

type WalletContextType = {
  provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | null,
  signer: ethers.Signer | null,
  selectedAddress: string | null,
  balance: string | null,
  setProvider: (provider: ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | null) => void,
  setSigner: (signer: ethers.Signer | null) => void,
  setSelectedAddress: (selectedAddress: string | null) => void,
  setBalance: (balance: string | null) => void
};

export const WalletContext = createContext<WalletContextType>({
  provider: null,
  signer: null,
  selectedAddress: null,
  balance: null,
  setProvider: () => {},
  setSigner: () => {},
  setSelectedAddress: () => {},
  setBalance: () => {}
});

export const WalletProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  return (
    <WalletContext.Provider value={{ provider, signer, selectedAddress, balance, setProvider, setSigner, setSelectedAddress, setBalance }}>
      {children}
    </WalletContext.Provider>
  );
};
