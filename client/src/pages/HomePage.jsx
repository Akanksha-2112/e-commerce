import React, { useState } from 'react';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import '../styles/LandingPage.css';
import logo from '../assets/logo.png';

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div 
      className="landing-page" 
      style={{ 
        minHeight: '100vh', 
        backgroundImage: `url(${logo})`, 
        backgroundSize: 'contain', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#ADD8E6' // light blue fallback color
      }}
    >
      <header className="landing-header">
        <div className="auth-buttons" style={{position: 'absolute', top: 20, right: 20}}>
          <button onClick={() => setShowSignIn(true)} className="btn-signin">Sign In</button>
          <button onClick={() => setShowSignUp(true)} className="btn-signup">Sign Up</button>
        </div>
      </header>

      {/* Your landing page content goes here */}

      {showSignIn && <SignIn onClose={() => setShowSignIn(false)} onSwitchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }} />}
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onSwitchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }} />}
    </div>
  );
};
export default LandingPage;
