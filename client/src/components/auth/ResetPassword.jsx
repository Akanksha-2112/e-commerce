import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../styles/LuxuryAuth.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`https://e-commerce-2e5z.onrender.com/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="luxury-auth-container">
            {/* Left Side - Image */}
            <div className="luxury-auth-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="luxury-image-overlay"></div>
                <div className="luxury-quote">
                    "Elegance is the only beauty that never fades."
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="luxury-auth-form-container">
                <div className="luxury-auth-content">
                    <div className="luxury-header">
                        <div className="luxury-icon-circle">
                            <FaLock size={20} color="#D4AF37" />
                        </div>
                        <h2 className="luxury-title">Reset Password</h2>
                        <p className="luxury-subtitle">Enter your new credentials below.</p>
                    </div>

                    {error && <div className="luxury-global-error">{error}</div>}
                    {message && <div style={{
                        padding: '1rem',
                        background: 'rgba(212, 175, 55, 0.1)',
                        color: '#D4AF37',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        border: '1px solid #D4AF37'
                    }}>{message}</div>}

                    <form onSubmit={handleSubmit} className="luxury-form">
                        <div className="luxury-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="luxury-input"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="luxury-label">New Password</label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '0.8rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#888'
                                }}
                            >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>

                        <div className="luxury-input-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="luxury-input"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <label className="luxury-label">Confirm Password</label>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '0.8rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#888'
                                }}
                            >
                                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="luxury-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span> Resetting...
                                </>
                            ) : (
                                'SET NEW PASSWORD'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
