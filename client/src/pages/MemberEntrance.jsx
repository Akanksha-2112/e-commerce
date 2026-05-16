import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaApple, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { mapLuxuryError } from '../utils/luxuryErrorMapper';
import ErrorBanner from '../components/common/ErrorBanner';
import '../styles/LuxuryAuth.css';
import luxuryImage from '../assets/luxury-auth.jpg';

const MemberEntrance = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('signin'); // signin, signup, reset
    const [globalError, setGlobalError] = useState('');
    const [showNewUserBridge, setShowNewUserBridge] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Validation Schemas
    const SignInSchema = Yup.object().shape({
        email: Yup.string().email('Please ensure your email address is entered correctly.').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const SignUpSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Please ensure your email address is entered correctly.').required('Email is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    });

    const ResetSchema = Yup.object().shape({
        email: Yup.string().email('Please ensure your email address is entered correctly.').required('Email is required'),
    });

    const handleAuthError = (error, formikSetSubmitting) => {
        const errorMessage = error.message || 'An unexpected interruption occurred.';

        if (errorMessage === 'AUTH_USER_NOT_FOUND' || errorMessage.includes('not found')) {
            setShowNewUserBridge(true);
            setGlobalError(''); // Clear generic error
        } else {
            setGlobalError(mapLuxuryError(errorMessage));
        }
        formikSetSubmitting(false);
    };

    // Formik Hooks
    const signInFormik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: SignInSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setGlobalError('');
            setShowNewUserBridge(false);
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate('/');
            } catch (err) {
                handleAuthError(err, setSubmitting);
            }
        },
    });

    const signUpFormik = useFormik({
        initialValues: { firstName: '', lastName: '', email: '', password: '' },
        validationSchema: SignUpSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setGlobalError('');
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate('/');
            } catch (err) {
                handleAuthError(err, setSubmitting);
            }
        },
    });

    const resetFormik = useFormik({
        initialValues: { email: '' },
        validationSchema: ResetSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setGlobalError('');
            setSuccessMessage('');
            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Reset failed');
                }

                setSubmitting(false); // Stop loading before showing success
                setSuccessMessage('An invitation to reset your access has been sent to your inbox.');
            } catch (err) {
                handleAuthError(err, setSubmitting);
            }
        },
    });

    const toggleView = (newView) => {
        setView(newView);
        setGlobalError('');
        setShowNewUserBridge(false);
        setSuccessMessage('');
        signInFormik.resetForm();
        signUpFormik.resetForm();
        resetFormik.resetForm();
    };

    return (
        <div className="luxury-auth-container">
            {/* Left Side - Image */}
            <div className="luxury-auth-image" style={{ backgroundImage: `url(${luxuryImage})` }}></div>

            {/* Right Side - Form */}
            <div className="luxury-auth-form-container">
                <AnimatePresence mode="wait">
                    {view === 'signin' && (
                        <motion.div
                            key="signin"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }}
                            className="luxury-auth-content"
                        >
                            <h1 className="luxury-title">ENTER THE<br />ATELIER</h1>
                            <p className="luxury-subtitle">Private collection access for registered members.</p>

                            <ErrorBanner message={globalError} onClose={() => setGlobalError('')} />

                            {showNewUserBridge && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="luxury-invite-container"
                                    style={{ marginBottom: '2rem' }}
                                >
                                    <p style={{ fontSize: '0.8rem', color: 'var(--luxury-gold)', marginBottom: '1rem' }}>This identity is not yet recognized in our database.</p>
                                    <button
                                        className="luxury-button secondary"
                                        onClick={() => toggleView('signup')}
                                        style={{ marginTop: 0 }}
                                    >
                                        JOIN THE MAISON
                                    </button>
                                </motion.div>
                            )}

                            <form className="luxury-form" onSubmit={signInFormik.handleSubmit}>
                                <div className="luxury-input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        className={`luxury-input ${signInFormik.touched.email && signInFormik.errors.email ? 'error' : ''}`}
                                        placeholder=" "
                                        {...signInFormik.getFieldProps('email')}
                                    />
                                    <label className="luxury-label">Email Address</label>
                                    {signInFormik.touched.email && signInFormik.errors.email && (
                                        <div className="luxury-error">{signInFormik.errors.email}</div>
                                    )}
                                </div>

                                <div className="luxury-input-wrapper">
                                    <input
                                        type="password"
                                        name="password"
                                        className={`luxury-input ${signInFormik.touched.password && signInFormik.errors.password ? 'error' : ''}`}
                                        placeholder=" "
                                        {...signInFormik.getFieldProps('password')}
                                    />
                                    <label className="luxury-label">Password</label>
                                    {signInFormik.touched.password && signInFormik.errors.password && (
                                        <div className="luxury-error">{signInFormik.errors.password}</div>
                                    )}
                                </div>

                                <button
                                    className="luxury-button"
                                    type="submit"
                                    disabled={signInFormik.isSubmitting || !signInFormik.isValid || !signInFormik.dirty}
                                >
                                    {signInFormik.isSubmitting ? <><span className="spinner"></span> VALIDATING...</> : 'ACCESS PROFILE'}
                                </button>
                            </form>

                            <div className="luxury-toggle-text">
                                <button className="luxury-link" style={{ fontSize: '0.7rem', opacity: 0.6 }} onClick={() => toggleView('reset')}>Lost Access?</button>
                            </div>

                            <div className="luxury-toggle-text">
                                NO ACCOUNT? 
                                <button className="luxury-link" onClick={() => toggleView('signup')}>JOIN NOW</button>
                            </div>

                            <div className="luxury-social-divider">
                                <span>AUTHENTICATE VIA</span>
                            </div>

                            <div className="luxury-social-buttons">
                                <button className="social-btn"><FaApple size={20} /></button>
                                <button className="social-btn"><FaGoogle size={18} /></button>
                            </div>
                        </motion.div>
                    )}

                    {view === 'signup' && (
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }}
                            className="luxury-auth-content"
                        >
                            <h1 className="luxury-title">JOIN THE<br />MAISON</h1>
                            <p className="luxury-subtitle">Experience bespoke shopping and early arrivals.</p>

                            <ErrorBanner message={globalError} onClose={() => setGlobalError('')} />

                            <form className="luxury-form" onSubmit={signUpFormik.handleSubmit}>
                                <div className="luxury-row">
                                    <div className="luxury-input-wrapper">
                                        <input
                                            type="text"
                                            name="firstName"
                                            className={`luxury-input ${signUpFormik.touched.firstName && signUpFormik.errors.firstName ? 'error' : ''}`}
                                            placeholder=" "
                                            {...signUpFormik.getFieldProps('firstName')}
                                        />
                                        <label className="luxury-label">First Name</label>
                                        {signUpFormik.touched.firstName && signUpFormik.errors.firstName && (
                                            <div className="luxury-error">{signUpFormik.errors.firstName}</div>
                                        )}
                                    </div>
                                    <div className="luxury-input-wrapper">
                                        <input
                                            type="text"
                                            name="lastName"
                                            className={`luxury-input ${signUpFormik.touched.lastName && signUpFormik.errors.lastName ? 'error' : ''}`}
                                            placeholder=" "
                                            {...signUpFormik.getFieldProps('lastName')}
                                        />
                                        <label className="luxury-label">Last Name</label>
                                        {signUpFormik.touched.lastName && signUpFormik.errors.lastName && (
                                            <div className="luxury-error">{signUpFormik.errors.lastName}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="luxury-input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        className={`luxury-input ${signUpFormik.touched.email && signUpFormik.errors.email ? 'error' : ''}`}
                                        placeholder=" "
                                        {...signUpFormik.getFieldProps('email')}
                                    />
                                    <label className="luxury-label">Email Address</label>
                                    {signUpFormik.touched.email && signUpFormik.errors.email && (
                                        <div className="luxury-error">{signUpFormik.errors.email}</div>
                                    )}
                                </div>

                                <div className="luxury-input-wrapper">
                                    <input
                                        type="password"
                                        name="password"
                                        className={`luxury-input ${signUpFormik.touched.password && signUpFormik.errors.password ? 'error' : ''}`}
                                        placeholder=" "
                                        {...signUpFormik.getFieldProps('password')}
                                    />
                                    <label className="luxury-label">Create Password</label>
                                    {signUpFormik.touched.password && signUpFormik.errors.password && (
                                        <div className="luxury-error">{signUpFormik.errors.password}</div>
                                    )}
                                </div>

                                <button
                                    className="luxury-button"
                                    type="submit"
                                    disabled={signUpFormik.isSubmitting || !signUpFormik.isValid || !signUpFormik.dirty}
                                >
                                    {signUpFormik.isSubmitting ? <><span className="spinner"></span> SECURING...</> : 'CREATE PROFILE'}
                                </button>
                            </form>

                            <div className="luxury-toggle-text">
                                ALREADY MEMBER?
                                <button className="luxury-link" onClick={() => toggleView('signin')}>ACCESS NOW</button>
                            </div>
                        </motion.div>
                    )}

                    {view === 'reset' && (
                        <motion.div
                            key="reset"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="luxury-auth-content luxury-glass-card"
                        >
                            <h1 className="luxury-title" style={{ fontSize: '2.5rem' }}>LOST ACCESS?</h1>
                            <p className="luxury-subtitle">RECOVER YOUR PRIVATE ACCOUNT</p>

                            <ErrorBanner message={globalError} onClose={() => setGlobalError('')} />
                            {successMessage && <div className="luxury-global-error" style={{ color: 'var(--luxury-gold)', borderColor: 'var(--luxury-gold)', backgroundColor: 'rgba(201, 168, 76, 0.05)' }}>{successMessage}</div>}

                            <form className="luxury-form" onSubmit={resetFormik.handleSubmit}>
                                <div className="luxury-input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        className={`luxury-input ${resetFormik.touched.email && resetFormik.errors.email ? 'error' : ''}`}
                                        placeholder=" "
                                        {...resetFormik.getFieldProps('email')}
                                    />
                                    <label className="luxury-label">Email Address</label>
                                    {resetFormik.touched.email && resetFormik.errors.email && (
                                        <div className="luxury-error">{resetFormik.errors.email}</div>
                                    )}
                                </div>

                                <button
                                    className="luxury-button"
                                    type="submit"
                                    disabled={resetFormik.isSubmitting || !resetFormik.isValid || !resetFormik.dirty}
                                >
                                    {resetFormik.isSubmitting ? <><span className="spinner"></span> SENDING...</> : 'RECOVER ACCESS'}
                                </button>
                            </form>

                            <div className="luxury-toggle-text">
                                <button className="luxury-link" onClick={() => toggleView('signin')}>BACK TO ENTRANCE</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MemberEntrance;
