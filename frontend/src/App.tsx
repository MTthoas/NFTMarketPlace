import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MarketPlace from './components/MarketPlace'; 
import Create from './components/Create';

import Footer from './components/Footer';

import Home from './components/home/Home'; // assurez-vous que Home est correctement importé


import { useState } from 'react';

const App = () => {

  const [account, setAccount] = useState<any | null>(null);

  return (
    <div>
      <Router>
        <div className="body mb-24">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} /> {/* utilisez element au lieu de component */}
            {/* add your other routes here */}
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
