import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NexusLanding.css';
import bgImage from '../assets/nexus_bg.png';

const NexusLanding = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleEnter = () => {
    // Navigate to the main shop or sarees page
    navigate('/sarees');
  };

  return (
    <div className="nexus-container">
      <img src={bgImage} alt="Architecture" className="nexus-bg" />
      <div className="nexus-overlay"></div>
      
      <div className="nexus-content">
        <h1 className="nexus-brand">Nexus Atelier</h1>
      </div>

      <div className="nexus-nav-trigger" onClick={toggleNav}></div>
      
      <div className={`nexus-nav-menu ${navOpen ? 'active' : ''}`}>
        <a href="/sarees" className="nexus-nav-item">Collection</a>
        <a href="/profile" className="nexus-nav-item">Atelier</a>
        <a href="/login" className="nexus-nav-item">Account</a>
      </div>

      <div className="nexus-cta" onClick={handleEnter}>
        <span>Enter</span>
        <div className="nexus-cta-line"></div>
      </div>
    </div>
  );
};

export default NexusLanding;
