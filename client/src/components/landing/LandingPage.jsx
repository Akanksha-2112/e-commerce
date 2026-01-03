import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over clickable elements
            const target = e.target;
            const isClickable = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a');
            setIsHovering(!!isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <div
            className={`custom-cursor ${isHovering ? 'hovered' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        />
    );
};

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="monolith-container">
            <CustomCursor />

            <div className="intro-overlay">
                <div className="intro-content">
                    <img src={require('../../assets/images/logo.png')} alt="AWIK SPECTRUM" className="intro-logo-img" />
                    <div className="intro-tagline">Authentic Luxury Sarees</div>
                </div>
            </div>

            <div className="monolith-background"></div>

            <nav className="monolith-nav">
                <img src={require('../../assets/images/logo.png')} alt="AWIK SPECTRUM" className="monolith-logo-img" />
                <button className="monolith-nav-btn" onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(40); // Haptic click
                    navigate('/login');
                }}>
                    Member Sign In
                </button>
            </nav>

            <div className="monolith-content">
                <div className="obsidian-glass-panel">
                    <div className="monolith-technical-header">EST. 2026 • MUMBAI</div>

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

export default LandingPage;
