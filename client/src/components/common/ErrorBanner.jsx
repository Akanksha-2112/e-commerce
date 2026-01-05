import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/LuxuryAuth.css';

const ErrorBanner = ({ message, onClose }) => {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="luxury-error-banner"
                >
                    <span className="error-text">{message}</span>
                    {onClose && (
                        <button onClick={onClose} className="close-btn">×</button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ErrorBanner;
