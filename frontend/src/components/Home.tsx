import React, { useContext, useEffect, useState } from 'react';
import { WalletContext } from './WalletContext';
import Web3 from 'web3';
import { ethers } from "ethers";


const Home: React.FC = () => {
  const walletContext = useContext(WalletContext);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    updateBalance();
  }, [walletContext]);

  const updateBalance = async () => {
    if (walletContext?.web3 && walletContext?.selectedAddress) {
      const balanceWei = await walletContext.web3.eth.getBalance(walletContext.selectedAddress);
      const balanceEther = Web3.utils.fromWei(balanceWei, 'ether');
      setBalance(balanceEther);
    } else {
      setBalance(null); // User is disconnected, set balance to null
    }
  };

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
