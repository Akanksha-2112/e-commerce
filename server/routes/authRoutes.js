import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import crypto from 'crypto';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import generateToken from '../utils/generateToken.js';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    sendVerificationEmail,
    changePassword,
    deleteAccount,
    getUserStats,
    uploadProfilePicture,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getRecentlyViewed,
    addToRecentlyViewed,
    verifyLoginOtp
} from '../controllers/authController.js';

const router = express.Router();

// FIX: Rate limiter for sensitive auth routes (max 10 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// FIX: Stricter limiter for OTP and password reset
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many attempts, please try again later.' },
});

// FIX: In-memory store for OAuth short-lived codes (use Redis in production)
const oauthCodes = new Map();

// Public routes — with validation + rate limiting applied
router.post(
  '/register',
  authLimiter,
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  registerUser
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  loginUser
);

router.post(
  '/verify-otp',
  strictLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number'),
  ],
  validateRequest,
  verifyLoginOtp
);

router.post(
  '/forgot-password',
  strictLimiter,
  [body('email').isEmail().normalizeEmail().withMessage('Valid email is required')],
  validateRequest,
  forgotPassword
);

router.post(
  '/reset-password/:token',
  strictLimiter,
  [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],
  validateRequest,
  resetPassword
);

router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.post('/send-verification', protect, sendVerificationEmail);
router.post('/upload-profile-picture', protect, upload.single('image'), uploadProfilePicture);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], validateRequest, changePassword);
router.delete('/delete-account', protect, deleteAccount);
router.get('/stats', protect, getUserStats);

// Wishlist Routes
router.route('/wishlist')
    .get(protect, getWishlist)
    .post(protect, [
      body('productId').notEmpty().isMongoId().withMessage('Valid product ID required'),
    ], validateRequest, addToWishlist);
router.delete('/wishlist/:id', protect, removeFromWishlist);

// Recently Viewed Routes
router.route('/recently-viewed')
    .get(protect, getRecentlyViewed)
    .post(protect, [
      body('productId').notEmpty().isMongoId().withMessage('Valid product ID required'),
    ], validateRequest, addToRecentlyViewed);

// Google OAuth routes
router.get('/google', (req, res, next) => {
    const passport = req.app.get('passport');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    const passport = req.app.get('passport');
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login`,
        session: false
    })(req, res, next);
}, (req, res) => {
    // FIX: Never put the JWT directly in the redirect URL (visible in browser history & logs).
    // Instead issue a short-lived one-time code; the frontend exchanges it for the real token.
    const token = generateToken(req.user._id);
    const code = crypto.randomBytes(16).toString('hex');

    oauthCodes.set(code, {
      token,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profilePicture: req.user.profilePicture,
        emailVerified: req.user.emailVerified
      }
    });

    // Code expires after 60 seconds
    setTimeout(() => oauthCodes.delete(code), 60 * 1000);

    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/oauth/callback?code=${code}`);
});

// FIX: New endpoint — frontend calls this to exchange the code for a real token
router.post('/oauth/exchange', (req, res) => {
    const { code } = req.body;
    const entry = oauthCodes.get(code);

    if (!entry) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OAuth code' });
    }

    oauthCodes.delete(code); // one-time use
    res.json({ success: true, token: entry.token, user: entry.user });
});

export default router;
