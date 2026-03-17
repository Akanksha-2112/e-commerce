import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`https://e-commerce-2e5z.onrender.com/api/auth/verify-email/${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Email verified successfully!');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Failed to verify email.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('An error occurred. Please try again.');
                console.error(err);
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token]);

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            fontFamily: "'Outfit', sans-serif",
            overflow: 'hidden',
        }}>
            {/* Abstract Background */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255, 125, 64, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    width: '90%',
                    maxWidth: '450px',
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                    padding: '40px',
                    position: 'relative',
                    zIndex: 1,
                    textAlign: 'center'
                }}
            >
                {status === 'verifying' && (
                    <div>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FaSpinner className="spin" size={50} color="#FF7D40" style={{ animation: 'spin 1s linear infinite' }} />
                            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              `}</style>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Verifying Email...</h2>
                        <p style={{ color: '#64748b' }}>Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: '#F0FDF4',
                            borderRadius: '50%',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FaCheckCircle size={40} color="#166534" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Verified!</h2>
                        <p style={{ color: '#64748b', marginBottom: '30px' }}>{message}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '12px',
                                background: '#FF7D40',
                                color: 'white',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 125, 64, 0.2)'
                            }}
                        >
                            Go to Login
                        </motion.button>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: '#FEF2F2',
                            borderRadius: '50%',
                            margin: '0 auto 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FaTimesCircle size={40} color="#EF4444" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px' }}>Verification Failed</h2>
                        <p style={{ color: '#64748b', marginBottom: '30px' }}>{message}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '12px',
                                background: '#94a3b8',
                                color: 'white',
                                border: 'none',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Back to Login
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
