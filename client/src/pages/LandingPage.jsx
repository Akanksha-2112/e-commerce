import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import CurtainIntro from '../components/CurtainIntro';
import logo from '../assets/logo.png';
import '../styles/LandingPage.css';

const categories = {
  Women: ['Dresses', 'Tops', 'Lehenga', 'Saree', 'Fabrics'],
  Men: ['Shirts', 'Pants', 'Suits', 'Fabrics'],
  Kids: ['T-Shirts', 'Shorts', 'Frocks', 'Fabrics'],
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCurtain, setShowCurtain] = useState(() => {
    const hasSeenCurtain = sessionStorage.getItem('hasSeenCurtain');
    return !hasSeenCurtain;
  });

  const handleCurtainComplete = () => {
    setShowCurtain(false);
    sessionStorage.setItem('hasSeenCurtain', 'true');
  };

  return (
    <>
      {showCurtain && <CurtainIntro onComplete={handleCurtainComplete} />}
      <div className="landing-page-main">
        <header className="main-header">
          {/* Hamburger Button */}
          <button
            className="hamburger"
            aria-label="Open Navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
          {/* Logo */}
          <img src={logo} alt="AWIK Fashion" className="main-logo" />
          {/* Nav */}
          <nav className={`main-nav ${menuOpen ? 'active' : ''}`}>
            <ul>
              {Object.keys(categories).map((cat) => (
                <li key={cat}>
                  {cat}
                  <ul className="submenu">
                    {categories[cat].map(item => (
                      <li key={item} onClick={() =>
                        navigate(item.toLowerCase() === 'fabrics' ? `/${cat.toLowerCase()}/fabrics` : `/design/${item.toLowerCase()}`)}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
          {/* Auth Btns */}
          <div className="header-actions">
            <button className="auth-btn" onClick={() => setShowSignIn(true)}>Sign In</button>
            <button className="auth-btn accent" onClick={() => setShowSignUp(true)}>Sign Up</button>
          </div>
        </header>
        <main className="main-content">
          <section className="hero-block">
            <h1 className="hero-title">Elevate Your Style</h1>
            <p className="hero-desc">
              Discover the new era of fashion with exquisite ethnic and contemporary collections, designed for those who demand luxury and authenticity.
            </p>
            <button className="main-cta" onClick={() => navigate('/design/lehenga')}>View Catalogue</button>
          </section>
          <section className="featured-collections">
            <h2>Our Signature Collections</h2>
            <div className="collections-grid">
              {Object.keys(categories).map(category => (
                <div className="collection-card" key={category}>
                  <h3>{category}</h3>
                  <ul>
                    {categories[category].map(item => (
                      <li
                        key={item}
                        onClick={() =>
                          navigate(item.toLowerCase() === 'fabrics'
                            ? `/${category.toLowerCase()}/fabrics`
                            : `/design/${item.toLowerCase()}`
                          )
                        }
                      >{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </main>
        <footer className="main-footer">
          <p>&copy; 2025 AWIK Fashion. All rights reserved.</p>
        </footer>
      </div>
      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </>
  );
};
export default LandingPage;
