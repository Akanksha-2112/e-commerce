import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';
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

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyLoginOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.post('/send-verification', protect, sendVerificationEmail);
router.post('/upload-profile-picture', protect, upload.single('image'), uploadProfilePicture);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);
router.get('/stats', protect, getUserStats);

// Wishlist Routes
router.route('/wishlist')
    .get(protect, getWishlist)
    .post(protect, addToWishlist);
router.delete('/wishlist/:id', protect, removeFromWishlist);

// Recently Viewed Routes
router.route('/recently-viewed')
    .get(protect, getRecentlyViewed)
    .post(protect, addToRecentlyViewed);


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
    // Generate JWT token for the user
    const token = generateToken(req.user._id);
    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?token=${token}&user=${encodeURIComponent(JSON.stringify({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profilePicture: req.user.profilePicture,
        emailVerified: req.user.emailVerified
    }))}`);
});

export default router;
