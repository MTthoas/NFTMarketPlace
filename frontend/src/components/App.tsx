import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import MarketPlace from './MarketPlace'; // assurez-vous que MarketPlace est correctement importé
import Home from './Home'; // assurez-vous que Home est correctement importé


import { useState } from 'react';

const App = () => {

  const [account, setAccount] = useState<any | null>(null);

  return (
    <div>
      <Router>
        <div className="body">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} /> {/* utilisez element au lieu de component */}
            {/* add your other routes here */}
            <Route path="/marketplace" element={<MarketPlace />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
