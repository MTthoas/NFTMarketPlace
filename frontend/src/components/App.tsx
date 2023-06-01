import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletContext } from './WalletContext';
import Web3 from 'web3';

import Home from './Home';
import Header from './h&f/Header';

class App extends React.Component<{}, { web3: Web3 | null, selectedAddress: string | null, balance: string | null }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      web3: null,
      selectedAddress: null,
      balance: null
    };
    this.setWallet = this.setWallet.bind(this);
    this.setBalance = this.setBalance.bind(this); // Add the setBalance function
  }

  setWallet = (web3: Web3 | null, selectedAddress: string | null) => {
    this.setState({ web3, selectedAddress });
  }

  setBalance = (balance: string | null) => {
    this.setState({ balance });
  }

  render() {
    return (
      <WalletContext.Provider value={{
        web3: this.state.web3,
        selectedAddress: this.state.selectedAddress,
        setWallet: this.setWallet,
        setBalance: this.setBalance // Add the setBalance function to the context value
      }}>
        <Router>
          <div className="body">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              {/* add your other routes here */}
            </Routes>
          </div>
        </Router>
      </WalletContext.Provider>
    );
  }
}

export default App;
