import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background grain texture */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                pointerEvents: 'none',
            }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
            >
                {/* Kicker */}
                <p style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#C9A84C',
                    marginBottom: '1.5rem',
                }}>
                    AWIK SPECTRUM
                </p>

                {/* Large 404 */}
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    style={{
                        fontFamily: "'Libre Bodoni', 'Playfair Display', serif",
                        fontSize: 'clamp(6rem, 18vw, 14rem)',
                        color: 'rgba(255,255,255,0.06)',
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        margin: '0 0 -1rem 0',
                        userSelect: 'none',
                    }}
                >
                    404
                </motion.h1>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{
                        height: '1px',
                        background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent)',
                        margin: '1.5rem auto',
                        width: '200px',
                    }}
                />

                <h2 style={{
                    fontFamily: "'Libre Bodoni', 'Playfair Display', serif",
                    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                    color: '#e8e8e8',
                    fontWeight: 400,
                    letterSpacing: '0.04em',
                    marginBottom: '1rem',
                }}>
                    This page has left the atelier.
                </h2>

                <p style={{
                    color: '#555',
                    fontSize: '0.88rem',
                    lineHeight: 1.8,
                    maxWidth: '380px',
                    margin: '0 auto 2.5rem',
                    letterSpacing: '0.03em',
                }}>
                    The piece you are looking for may have been moved, retired, or never existed in our collection.
                </p>

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: '#C9A84C',
                            color: '#0a0a0a',
                            border: 'none',
                            padding: '14px 32px',
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'opacity 0.25s',
                        }}
                        onMouseOver={e => e.target.style.opacity = '0.85'}
                        onMouseOut={e => e.target.style.opacity = '1'}
                    >
                        Return to Maison
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'transparent',
                            color: '#888',
                            border: '1px solid #2a2a2a',
                            padding: '14px 32px',
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'border-color 0.25s, color 0.25s',
                        }}
                        onMouseOver={e => { e.target.style.borderColor = '#555'; e.target.style.color = '#ccc'; }}
                        onMouseOut={e => { e.target.style.borderColor = '#2a2a2a'; e.target.style.color = '#888'; }}
                    >
                        Go Back
                    </button>
                </div>
            </motion.div>

            {/* Decorative bottom text */}
            <p style={{
                position: 'absolute',
                bottom: '30px',
                fontSize: '0.65rem',
                letterSpacing: '0.25em',
                color: '#222',
                textTransform: 'uppercase',
            }}>
                MAISON PRIVÉ · EST. MMXXIV
            </p>
        </div>
    );
};

export default NotFoundPage;
