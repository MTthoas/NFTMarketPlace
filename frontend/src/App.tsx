import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Outlet/Header';
import MarketPlace from './components/pages/MarketPlace/MarketPlace'; 
import Create from './components/pages/Create/Create';
import Wallet from './components/pages/Wallet/Wallet';
import Nft from './components/pages/MarketPlace/NftDetails';

import Footer from './components/Outlet/Footer';

import Home from './components/pages/home/Home'; // assurez-vous que Home est correctement importé

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';

const App = () => {

  return (
    <div>
      <ToastContainer />
      <Router>
        <div className="body mb-24">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} /> {/* utilisez element au lieu de component */}
            {/* add your other routes here */}
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/nft/:id" element={<Nft />} />
            <Route path="/create" element={<Create />} />
            <Route path="/wallet" element={<Wallet/>} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
