import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaGoogle, FaFacebook } from 'react-icons/fa';

const SignUp = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  // Inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // States: 'entry' -> 'protocol-check' -> 'success'
  const [signupStage, setSignupStage] = useState('entry');



  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError("Protocol acceptance required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Security keys do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Encryption strength insufficient (min 6 chars).");
      return;
    }

    setIsLoading(true);
    // Simulate complex "Identity Verification" delay
    setTimeout(async () => {
      try {
        const result = await register(firstName, lastName, email, password);
        if (!result.success) {
          setError(result.message || "Registration signal rejected.");
          setIsLoading(false);
        } else {
          // Success -> Redirect to Elite Success Screen
          navigate('/inquiry-confirmed', { state: { name: firstName } });
        }
      } catch (err) {
        setError("Vault Creation Failed.");
        setIsLoading(false);
      }
    }, 1200);
  };

  // Social Login Handlers
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/facebook';
  };

  return (
    <div className="desktop-vault">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

        .desktop-vault {
            min-height: 100vh;
            width: 100vw;
            background-color: #050505;
            color: #e5e5e5;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            display: flex;
        }

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
            max-width: 440px;
            padding: 40px;
            background: rgba(10, 10, 10, 0.75);
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
            border-radius: 50%; 
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
            color: #d4af37; /* Gold for creation/signup */
            filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.4));
        }

        /* Middle: Minimal Inputs */
        .input-stack {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
        }
        .minimal-input {
            width: 100%;
            background: transparent;
            border: none;
            border-bottom: 1px solid #333;
            color: #fff;
            padding: 10px 0;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            letter-spacing: 0.05em;
            transition: border-color 0.3s;
        }
        .minimal-input:focus {
            outline: none;
            border-bottom-color: #d4af37;
        }
        .minimal-input::placeholder {
            color: #555;
            text-transform: uppercase;
            font-size: 0.7rem;
            letter-spacing: 0.15em;
        }

        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #d4af37 0%, #b49129 100%);
            color: #000;
            border: 1px solid #3f3f46;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 10px;
        }
        .submit-btn:hover {
            background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
            letter-spacing: 0.25em;
        }

        /* Checkbox */
        .terms-row {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.7rem;
            color: #666;
            margin-bottom: 20px;
            cursor: pointer;
        }
        .custom-check {
            width: 14px; height: 14px;
            border: 1px solid #444;
            display: flex; align-items: center; justify-content: center;
        }
        .terms-row input:checked + .custom-check {
            background: #d4af37;
            border-color: #d4af37;
        }
        .terms-row input:checked + .custom-check::after {
            content: ''; width: 40%; height: 40%; background: #000;
        }

        /* Bottom: Social (Etched) */
        .social-row {
            width: 100%;
            display: flex;
            gap: 15px;
            margin-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 25px;
        }
        .social-btn {
             flex: 1;
             height: 40px;
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
            font-size: 1rem;
            color: #888;
            filter: grayscale(100%);
        }
        .social-btn:hover .social-icon { color: #fff; }
      `}</style>

      <div className="brand-corner">
        <img src="/brand-logo-corner.png" width="120" alt="Logo" />
      </div>
      <div className="arch-caption">Initialize Access</div>

      <div className="obsidian-card">
        {/* Top */}
        <div className="bio-header">
          <div className="bio-icon-wrapper">
            <FaUserPlus size={28} className="mercury-glow" />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#666', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            New Membership
          </div>
        </div>

        {/* Middle: Inputs */}
        <form onSubmit={handleInitialSubmit} className="input-stack">
          <div style={{ display: 'flex', gap: '15px' }}>
            <input
              className="minimal-input"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              className="minimal-input"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <input
            className="minimal-input"
            type="email"
            placeholder="Digital Contact (Email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="minimal-input"
            type="password"
            placeholder="Create Access Key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="minimal-input"
            type="password"
            placeholder="Confirm Access Key"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label className="terms-row">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} style={{ display: 'none' }} />
            <div className="custom-check"></div>
            <span style={{ letterSpacing: '0.05em' }}>I ACCEPT THE MEMBERSHIP PROTOCOL</span>
          </label>

          {error && <div style={{ color: '#ef4444', fontSize: '0.7rem', textAlign: 'center', letterSpacing: '0.05em' }}>{error}</div>}

          <button type="button" className="submit-btn" onClick={handleInitialSubmit}>
            {isLoading ? 'Encrypting...' : 'Secure Membership'}
          </button>
        </form>

        <div style={{ marginTop: '10px', fontSize: '0.65rem', textAlign: 'center' }}>
          <span style={{ color: '#666', letterSpacing: '0.1em' }}>ALREADY SECURED? </span>
          <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none', letterSpacing: '0.1em', fontWeight: 'bold' }}>
            ACCESS VAULT
          </Link>
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
      </div>
    </div>
  );
};

export default SignUp;
