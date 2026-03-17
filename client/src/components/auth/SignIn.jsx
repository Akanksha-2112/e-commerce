import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFingerprint, FaShieldAlt, FaGoogle, FaFacebook } from 'react-icons/fa';
import ForgotPasswordModal from './ForgotPasswordModal';

const SignIn = () => {
  const { login, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();

  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Auth Flow: 'entry' -> '2fa' -> 'authenticated'
  const [authStage, setAuthStage] = useState('entry');
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);

  // Refs for 2FA inputs
  const codeRefs = useRef([]);

  // Biometric Interactivity
  const handleBiometricClick = () => {
    // Just a visual shake or fill to show it's "Listening" but inputs are primary now
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Identity parameters missing.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password, rememberMe);
      setIsLoading(false);
      if (result.success) {
        if (result.type === 'token') {
          navigate('/sarees');
        } else {
          setAuthStage('2fa');
          setTwoFactorCode(['', '', '', '', '', '']); // Clear for fresh input
        }
      } else {
        setError(result.message || "Access Denied.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Connection Failed.");
    }
  };

  const handle2FAChange = (index, value) => {
    if (value.length > 1) return; // Prevent multi-char
    const newCode = [...twoFactorCode];
    newCode[index] = value;
    setTwoFactorCode(newCode);

    // Auto-focus next
    if (value && index < 5) {
      codeRefs.current[index + 1].focus();
    }

    // Auto-submit?
    if (newCode.every(c => c !== '')) {
      handleFinalAuth(newCode.join(''));
    }
  };

  const handle2FAKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
      codeRefs.current[index - 1].focus();
    }
  };

  const handleFinalAuth = async (code) => {
    setIsLoading(true);
    try {
      const result = await verifyOtp(email, code);
      setIsLoading(false);
      if (!result.success) {
        setError(result.message || "Invalid Code.");
        setTwoFactorCode(['', '', '', '', '', '']);
      }
      // Success -> Redirect handled by verifyOtp context function
    } catch (err) {
      setIsLoading(false);
      setError("Verification Failed.");
      setTwoFactorCode(['', '', '', '', '', '']);
    }
  };


  // Social Login Handlers
  const handleGoogleLogin = () => {
    window.location.href = 'https://e-commerce-2e5z.onrender.com/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'https://e-commerce-2e5z.onrender.com/api/auth/facebook';
  };

  return (
    <div className="desktop-vault">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

        .desktop-vault {
            min-height: 100vh;
            width: 100vw;
            background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/signup_bg.png') no-repeat center center/cover;
            color: #e5e5e5;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        /* Ambient Background Effect */
        .desktop-vault::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(20, 20, 20, 0.4) 0%, rgba(0,0,0,0.8) 100%);
            pointer-events: none;
        }

        /* Brand Corner */
        .brand-corner {
            position: absolute;
            top: 40px;
            left: 40px;
            z-index: 10;
        }

        /* Arch Caption (Moved to absolute) */
        .arch-caption {
            position: absolute;
            bottom: 40px;
            left: 40px;
            font-family: 'Playfair Display', serif;
            font-style: italic;
            font-size: 1.5rem;
            color: rgba(255,255,255,0.4);
            letter-spacing: 0.05em;
            z-index: 10;
        }
        
        /* Obsidian Card (Centered) */
        .obsidian-card {
            width: 100%;
            max-width: 420px;
            padding: 40px;
            background: rgba(10, 10, 10, 0.75); /* Slightly more transparent */
            backdrop-filter: blur(40px);
            border: 0.5px solid rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            box-shadow: 0 50px 100px -20px rgba(0,0,0,0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 20;
        }
        
        /* Top: Biometric Identity */
        .bio-header {
            margin-bottom: 30px;
            text-align: center;
        }
        .bio-icon-wrapper {
            width: 80px;
            height: 80px;
            border-radius: 50%; /* Liquid Mercury shape */
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px auto;
            position: relative;
            box-shadow: 0 0 20px rgba(255,255,255,0.05);
            transition: all 0.5s ease;
        }
        .bio-icon-wrapper:hover {
            box-shadow: 0 0 30px rgba(255,255,255,0.15);
            border-color: rgba(255,255,255,0.4);
        }
        .mercury-glow {
            color: #e5e5e5;
            filter: drop-shadow(0 0 5px rgba(255,255,255,0.4));
        }

        /* Middle: Minimal Inputs */
        .input-stack {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 40px;
        }
        .minimal-input {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 1px solid #333;
            color: #fff;
            padding: 12px 0;
            font-family: 'Inter', sans-serif;
            font-size: 0.95rem;
            letter-spacing: 0.05em;
            transition: border-color 0.3s;
        }
        .minimal-input:focus {
            outline: none;
            border-bottom-color: #fff;
        }
        .minimal-input::placeholder {
            color: #555;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.15em;
        }

        .submit-btn {
            width: 100%;
            padding: 16px;
            background: #fff;
            color: #000;
            border: none;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s;
        }
        .submit-btn:hover {
            background: #d4d4d4;
            letter-spacing: 0.25em;
        }

        /* Bottom: Social (Etched) */
        .social-row {
            width: 100%;
            display: flex;
            gap: 15px;
            margin-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 30px;
        }
        .social-btn {
             flex: 1;
             height: 44px;
             display: flex;
             align-items: center;
             justify-content: center;
             background: rgba(255,255,255,0.02);
             border: 0.5px solid rgba(255,255,255,0.1);
             cursor: pointer;
             transition: all 0.3s;
        }
        .social-btn:hover {
            background: rgba(255,255,255,0.08);
            border-color: rgba(255,255,255,0.3);
        }
        .social-icon {
            font-size: 1.1rem;
            color: #888;
            filter: grayscale(100%);
        }
        .social-btn:hover .social-icon { color: #fff; }

        /* 2FA Overlay: Glass Grid */
        .glass-grid-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(10px);
            z-index: 20;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 4px; /* Match card radius */
        }
        .grid-container {
            display: flex;
            gap: 12px;
            margin: 40px 0;
        }
        .grid-cell {
            width: 50px;
            height: 60px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            font-size: 1.5rem;
            text-align: center;
            font-family: 'Playfair Display', serif;
        }
        .grid-cell:focus {
            outline: none;
            border-color: #fff;
            background: rgba(255,255,255,0.1);
            box-shadow: 0 0 15px rgba(255,255,255,0.1);
        }
      `}</style>

      <div className="brand-corner">
        <img src="/brand-logo-corner.png" width="120" alt="Logo" />
      </div>
      <div className="arch-caption">Architecture of Trust</div>

      <div className="obsidian-card">
        {/* Top: Biometric */}
        <div className="bio-header">
          <div className="bio-icon-wrapper">
            <FaFingerprint size={32} className="mercury-glow" />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Secure Entry
          </div>
        </div>

        {/* Middle: Inputs */}
        <form onSubmit={handleInitialSubmit} className="input-stack">
          <input
            className="minimal-input"
            type="email"
            placeholder="Identity"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="minimal-input"
            type="password"
            placeholder="Access Key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && authStage !== '2fa' && (
            <div style={{
              color: '#ef4444',
              fontSize: '0.75rem',
              textAlign: 'center',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '4px',
              padding: '10px',
              marginTop: '5px'
            }}>
              {error}
            </div>
          )}

          <button type="button" className="submit-btn" onClick={handleInitialSubmit}>
            {isLoading ? 'Processing...' : 'Verify Access'}
          </button>
        </form>

        <div style={{ width: '100%', textAlign: 'center', marginBottom: '10px' }}>
          <button onClick={() => setShowForgotPassword(true)} style={{ background: 'none', border: 'none', color: '#888', fontSize: '0.65rem', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Lost Credentials?
          </button>
        </div>

        {/* Bottom: Social */}
        <div className="social-row">
          <button className="social-btn" onClick={handleGoogleLogin}>
            <FaGoogle className="social-icon" />
          </button>
          <button className="social-btn" onClick={handleFacebookLogin}>
            <FaFacebook className="social-icon" />
          </button>
        </div>

        {/* Signup Link (Restored) */}
        <div style={{ marginTop: '30px', fontSize: '0.65rem', textAlign: 'center' }}>
          <span style={{ color: '#666', letterSpacing: '0.1em' }}>NO ACCESS? </span>
          <Link to="/register" style={{ color: '#d4af37', textDecoration: 'none', letterSpacing: '0.1em', fontWeight: 'bold' }}>
            REQUEST ENTRY
          </Link>
        </div>

        {/* 2FA Overlay (Simulated Auto-Scan) */}
        <AnimatePresence>
          {authStage === '2fa' && (
            <motion.div
              className="glass-grid-overlay"
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
              exit={{ opacity: 0 }}
            >
              <FaShieldAlt size={40} color="#fff" style={{ marginBottom: '20px' }} />
              <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ccc' }}>
                Two-Factor Authentication
              </div>
              <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '10px' }}>
                ENTER CODE SENT TO {email}
              </div>

              <div className="grid-container">
                {twoFactorCode.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => codeRefs.current[idx] = el}
                    className="grid-cell"
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handle2FAChange(idx, e.target.value)}
                    onKeyDown={(e) => handle2FAKeyDown(idx, e)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {error && (
                <div style={{
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  textAlign: 'center',
                  marginBottom: '20px',
                  textShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={() => setAuthStage('entry')}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', color: '#888', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '0.1em' }}
              >
                CANCEL VERIFICATION
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default SignIn;
