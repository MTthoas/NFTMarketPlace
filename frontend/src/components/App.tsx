import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ethers } from 'ethers';

import { WalletProvider } from './WalletContext';
import Home from './Home';
import Header from './h&f/Header';

class App extends React.Component {
  render() {
    return (
      <WalletProvider>
        <Router>
          <div className="body">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              {/* add your other routes here */}
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    );
  }
}

export default App;
