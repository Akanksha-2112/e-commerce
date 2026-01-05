import React from 'react';
import FixedNavigation from '../components/common/FixedNavigation';
import '../styles/PremiumTheme.css'; // Reuse premium styles if needed

const FixedLandingPage = () => {
    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <FixedNavigation />

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                marginLeft: '280px', // Offset for fixed sidebar
                height: '100%',
                backgroundColor: '#000',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Placeholder for Video/Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: "'Didot', serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                }}>
                    <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Autumn / Winter</h1>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', letterSpacing: '0.3em' }}>
                        The 2026 Collection
                    </p>
                    <button style={{
                        marginTop: '40px',
                        background: 'transparent',
                        border: '1px solid #fff',
                        color: '#fff',
                        padding: '15px 40px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: '0.8rem',
                        letterSpacing: '0.2em',
                        cursor: 'pointer',
                        transition: 'background 0.3s, color 0.3s'
                    }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#fff';
                            e.target.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#fff';
                        }}
                    >
                        Explore Campaign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FixedLandingPage;
