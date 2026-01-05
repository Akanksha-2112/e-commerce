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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="luxury-auth-content"
                        >
                            <h1 className="luxury-title font-playfair">ENTER THE ATELIER</h1>
                            <p className="luxury-subtitle font-inter">Please enter your credentials to access your private profile.</p>

                            <ErrorBanner message={globalError} onClose={() => setGlobalError('')} />

                            {showNewUserBridge && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="luxury-invite-container"
                                >
                                    <p className="luxury-invite-text">This identity is not yet part of our private collection. Would you like to Join the Atelier?</p>
                                    <button
                                        className="luxury-button secondary"
                                        onClick={() => toggleView('signup')}
                                    >
                                        JOIN THE ATELIER
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
                                    <label className="luxury-label">Private Password</label>
                                    {signInFormik.touched.password && signInFormik.errors.password && (
                                        <div className="luxury-error">{signInFormik.errors.password}</div>
                                    )}
                                </div>

                                <button
                                    className="luxury-button"
                                    type="submit"
                                    disabled={signInFormik.isSubmitting || !signInFormik.isValid || !signInFormik.dirty}
                                >
                                    {signInFormik.isSubmitting ? <><span className="spinner"></span> VALIDATING...</> : 'ACCESS YOUR PROFILE'}
                                </button>
                            </form>

                            <div className="luxury-toggle-text">
                                <button className="luxury-link" onClick={() => toggleView('reset')}>Forgot Password?</button>
                            </div>

                            <div className="luxury-toggle-text">
                                Not a member yet?
                                <button className="luxury-link" onClick={() => toggleView('signup')}>Join the Maison</button>
                            </div>

                            <div className="luxury-social-divider">
                                <span>OR CONTINUE WITH</span>
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="luxury-auth-content"
                        >
                            <h1 className="luxury-title font-playfair">JOIN THE MAISON</h1>
                            <p className="luxury-subtitle font-inter">Experience early access to collections and bespoke services.</p>

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
                                    <label className="luxury-label">Private Password</label>
                                    {signUpFormik.touched.password && signUpFormik.errors.password && (
                                        <div className="luxury-error">{signUpFormik.errors.password}</div>
                                    )}
                                </div>

                                <button
                                    className="luxury-button"
                                    type="submit"
                                    disabled={signUpFormik.isSubmitting || !signUpFormik.isValid || !signUpFormik.dirty}
                                >
                                    {signUpFormik.isSubmitting ? <><span className="spinner"></span> SECURING...</> : 'CREATE PRIVATE PROFILE'}
                                </button>
                            </form>

                            <div className="luxury-toggle-text">
                                Already have access?
                                <button className="luxury-link" onClick={() => toggleView('signin')}>Access Profile</button>
                            </div>
                        </motion.div>
                    )}

                    {view === 'reset' && (
                        <motion.div
                            key="reset"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="luxury-auth-content luxury-glass-card"
                        >
                            <h1 className="luxury-title font-playfair" style={{ fontSize: '1.8rem' }}>RESET ACCESS</h1>
                            <p className="luxury-subtitle font-inter">Please provide your email to receive a secure link.</p>

                            <ErrorBanner message={globalError} onClose={() => setGlobalError('')} />
                            {successMessage && <div className="luxury-global-error" style={{ color: '#2E7D32', borderColor: '#2E7D32', backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>{successMessage}</div>}

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
                                <button className="luxury-link" onClick={() => toggleView('signin')}>Return to Entrance</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MemberEntrance;
