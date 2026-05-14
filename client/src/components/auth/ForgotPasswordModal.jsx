import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './ForgotPasswordModal.css';

import { API_BASE } from '../../config';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email }, { timeout: 15000 });
            setMessage(data.message || 'Password reset email sent! Please check your inbox.');
            setEmail('');
            setTimeout(() => {
                onClose();
                setMessage('');
            }, 3000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset email';
            setError(errorMessage);
            console.error("Reset Password Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h2>Reset Password</h2>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-form">
                        <p className="modal-description">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ForgotPasswordModal;
