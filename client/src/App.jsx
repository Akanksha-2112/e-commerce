import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LehengaPage from './pages/LehengaPage';
import SareePage from './pages/SareePage';
import KurtiPage from './pages/KurtiPage';
import ShirtsPage from './pages/ShirtsPage';
import PantsPage from './pages/PantsPage';
import TopsPage from './pages/TopsPage';
import DressesPage from './pages/DressesPage';
import KidsGirlsPage from './pages/KidsGirlsPage';
import KidsBoysPage from './pages/KidsBoysPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<LandingPage />} />

        {/* Adult categories */}
        <Route path="/design/lehenga" element={<LehengaPage />} />
        <Route path="/design/saree" element={<SareePage />} />
        <Route path="/design/kurti" element={<KurtiPage />} />
        <Route path="/design/shirts" element={<ShirtsPage />} />
        <Route path="/design/pants" element={<PantsPage />} />
        <Route path="/design/tops" element={<TopsPage />} />
        <Route path="/design/dresses" element={<DressesPage />} />

        {/* Kids categories */}
        <Route path="/design/kids/girls" element={<KidsGirlsPage />} />
        <Route path="/design/kids/boys" element={<KidsBoysPage />} />

        {/* (Add new routes as your catalog grows) */}
      </Routes>
    </Router>
  );
}

export default App;
