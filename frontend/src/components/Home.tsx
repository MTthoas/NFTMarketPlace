import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from './WalletContext';
import { ethers } from "ethers";

const Home: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletContext.selectedAddress && walletContext.provider) {
        const balance = await walletContext.provider.getBalance(walletContext.selectedAddress);
        setBalance(ethers.utils.formatEther(balance || '0'));
      }
    };

    fetchBalance();

    const intervalId = setInterval(fetchBalance, 1000);

    return () => clearInterval(intervalId);
  }, [walletContext]);

  return (
    <div>
      {balance !== null ? (
        <p className='ml-10'>Your balance: {balance} Ether</p>
      ) : (
        <p className='ml-10'>Please connect to a wallet</p>
      )}
    </div>
  );
};

export default Home;
