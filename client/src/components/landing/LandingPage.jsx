import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../../context/GlobalContext';
import { AuthContext } from '../../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { toggleSidebar } = useGlobal();
    const { user } = React.useContext(AuthContext);
    const [showIntro, setShowIntro] = useState(false);

    useEffect(() => {
        // Check if user has already seen the intro in this session
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
        if (!hasSeenIntro) {
            setShowIntro(true);
            sessionStorage.setItem('hasSeenIntro', 'true');
        }
    }, []);

    return (
        <div className="monolith-container">
            {/* Intro Overlay maintained - Conditionally Rendered */}
            {showIntro && (
                <div className="intro-overlay">
                    <div className="intro-content">
                        <img src={require('../../assets/images/logo.png')} alt="AWIK SPECTRUM" className="intro-logo-img" />
                        {/* Restored original logo colors */}
                        <div className="intro-tagline" style={{ color: '#D4AF37' }}>Authentic Luxury Sarees</div>
                    </div>
                </div>
            )}

            <div className="monolith-background"></div>

            {/* Vertical Header */}
            <header className="vertical-header">
                <img
                    src={require('../../assets/images/logo.png')}
                    alt="Logo"
                    className="header-logo"
                    onClick={() => navigate('/')}
                />

                <button className="menu-trigger" onClick={() => toggleSidebar(true)}>
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                    <span className="menu-line"></span>
                </button>
            </header>

            {/* Personalized Greeting */}
            <div className="greeting-container">
                {user ? (
                    <Greeting user={user} />
                ) : (
                    <span onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
                        Sign In
                    </span>
                )}
            </div>

            <div className="monolith-content">
                <div className="obsidian-glass-panel">
                    <div className="monolith-technical-header">EST. 2026 • INDIA</div>

                    <h1 className="monolith-headline">
                        The Sovereign<br />Collection
                    </h1>

                    <MagneticButton onClick={() => navigate('/register')} />
                </div>
            </div>
        </div>
    );
};

const MagneticButton = ({ onClick }) => {
    const btnRef = useRef(null);

    const handleMouseMove = (e) => {
        const btn = btnRef.current;
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;

        // Calculate distance from center
        const distX = e.clientX - btnX;
        const distY = e.clientY - btnY;

        // Magnetic pull strength
        const pullStrength = 0.4;

        // Apply transform
        btn.style.transform = `translate(${distX * pullStrength}px, ${distY * pullStrength}px)`;
    };

    const handleMouseLeave = () => {
        const btn = btnRef.current;
        if (btn) {
            btn.style.transform = `translate(0px, 0px)`;
        }
    };

    return (
        <button
            ref={btnRef}
            className="monolith-cta magnetic-btn"
            onClick={() => {
                if (navigator.vibrate) navigator.vibrate(60); // Heavier haptic for main CTA
                onClick();
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            Request Invitation
        </button>
    );
};

const Greeting = ({ user }) => {
    const navigate = useNavigate();
    const [name, setName] = useState(null);

    const resolveName = (userData) => {
        if (!userData) return null;
        // 1. Try First Name
        if (userData.firstName && userData.firstName !== 'undefined') return userData.firstName;

        // 2. Try Full Name
        if (userData.name && !userData.name.includes('undefined')) return userData.name.split(' ')[0];

        // 3. Try Email Username (Title Case)
        if (userData.email) {
            const emailName = userData.email.split('@')[0];
            return emailName.charAt(0).toUpperCase() + emailName.slice(1).toLowerCase();
        }

        // 4. Last Resort
        return "Member";
    };

    useEffect(() => {
        let isMounted = true;

        // Initial setup
        const initialName = resolveName(user);
        setName(initialName);

        const fetchName = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) {
                        const freshName = resolveName(data);
                        setName(freshName);
                    }
                }
            } catch (err) {
                // Keep initial name if fetch fails
            }
        };

        fetchName();
        return () => { isMounted = false; };
    }, [user]);

    return (
        <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            Hello {name || "Member"}
        </span>
    );
};

export default LandingPage;
