import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail, passwordResetEmail, emailVerificationEmail, welcomeEmail, otpEmail } from '../utils/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profilePicture,
      emailVerified: user.emailVerified,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user (Step 1: Validate Password & Send OTP)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Hash OTP before saving (security best practice)
      user.loginOtp = crypto.createHash('sha256').update(otp).digest('hex');
      user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      // Send OTP Email
      const html = otpEmail(user, otp);
      const logoPath = path.join(__dirname, '../../client/public/logo.png');

      try {
        const emailResult = await sendEmail({
          email: user.email,
          subject: 'AUTHENTICATION PROTOCOL',
          html,
          attachments: [{
            filename: 'logo.png',
            path: logoPath,
            cid: 'logo'
          }]
        });

        if (!emailResult.success) {
          throw new Error('Email service failed to send OTP');
        }

        res.json({
          success: true,
          message: 'OTP sent to email',
          otpSent: true, // Flag for frontend
          email: user.email
        });
      } catch (error) {
        console.error('OTP Send Error:', error);
        user.loginOtp = undefined;
        user.loginOtpExpires = undefined;
        await user.save();
        res.status(500);
        throw new Error('Email could not be sent');
      }
    } else {
      // 2FA Disabled: Login Immediately
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        token: generateToken(user._id)
      });
    }

  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Verify Login OTP (Step 2: Issue Token)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Hash the entered OTP to compare
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    email,
    loginOtp: hashedOtp,
    loginOtpExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired OTP');
  }

  // Clear OTP
  user.loginOtp = undefined;
  user.loginOtpExpires = undefined;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    profilePicture: user.profilePicture,
    emailVerified: user.emailVerified,
    token: generateToken(user._id)
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profilePicture,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;

    if (req.body.twoFactorEnabled !== undefined) {
      user.twoFactorEnabled = req.body.twoFactorEnabled;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profilePicture: updatedUser.profilePicture,
      emailVerified: updatedUser.emailVerified,
      twoFactorEnabled: updatedUser.twoFactorEnabled,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upload profile picture
// @route   POST /api/auth/upload-profile-picture
// @access  Private
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const user = await User.findById(req.user._id);

  if (user) {
    // Construct local file URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    user.profilePicture = {
      url: imageUrl,
      public_id: req.file.filename // Using filename as ID for local storage
    };

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      profilePicture: updatedUser.profilePicture,
      emailVerified: updatedUser.emailVerified,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('No user found with that email');
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

  // Send email
  const emailHtml = passwordResetEmail(user, resetUrl);
  const emailResult = await sendEmail({
    email: user.email,
    subject: 'Password Reset Request - AWIK SPECTRUM',
    html: emailHtml
  });

  if (!emailResult.success) {
    res.status(500);
    throw new Error('Email could not be sent. Please try again later.');
  }

  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash token to compare with database
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Hash token
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({ emailVerificationToken });

  if (!user) {
    res.status(400);
    throw new Error('Invalid verification token');
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Send verification email
// @route   POST /api/auth/send-verification
// @access  Private
export const sendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.emailVerified) {
    res.status(400);
    throw new Error('Email already verified');
  }

  // Generate verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Create verification URL
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;

  // Send email
  const emailHtml = emailVerificationEmail(user, verificationUrl);
  await sendEmail({
    email: user.email,
    subject: 'Verify Your Email - AWIK SPECTRUM',
    html: emailHtml
  });

  res.json({
    success: true,
    message: 'Verification email sent'
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Delete account
// @route   DELETE /api/auth/delete-account
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Password is incorrect');
  }

  // Delete user
  await user.deleteOne();

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
export const getUserStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('orders');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Calculate statistics
  const totalOrders = user.orders.length;
  const totalSpent = user.orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const wishlistCount = user.wishlist ? user.wishlist.length : 0;

  res.json({
    totalOrders,
    totalSpent,
    memberSince: user.createdAt,
    emailVerified: user.emailVerified,
    wishlistCount
  });
});

// @desc    Get user wishlist
// @route   GET /api/auth/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
});

// @desc    Add to wishlist
// @route   POST /api/auth/wishlist
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }

    user.wishlist.push(productId);
    await user.save();
    res.json({ message: 'Product added to wishlist' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Remove from wishlist
// @route   DELETE /api/auth/wishlist/:id
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
    await user.save();
    res.json({ message: 'Product removed from wishlist' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get recently viewed products
// @route   GET /api/auth/recently-viewed
// @access  Private
export const getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'recentlyViewed.product',
    model: 'Product'
  });

  const validProducts = user.recentlyViewed
    .filter(item => item.product) // Remove nulls if product deleted
    .sort((a, b) => b.viewedAt - a.viewedAt)
    .slice(0, 10); // Limit to 10

  res.json(validProducts);
});

// @desc    Add to recently viewed
// @route   POST /api/auth/recently-viewed
// @access  Private
export const addToRecentlyViewed = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    // Remove if already exists to update timestamp (re-add at end/start?? actually we sort by date)
    // Easier: find existing index
    const existingIndex = user.recentlyViewed.findIndex(item => item.product.toString() === productId);

    if (existingIndex !== -1) {
      user.recentlyViewed.splice(existingIndex, 1);
    }

    // Add to beginning or end - Schema has default date.now, so just push
    user.recentlyViewed.push({ product: productId, viewedAt: Date.now() });

    // Limit to 20
    if (user.recentlyViewed.length > 20) {
      user.recentlyViewed.shift(); // Remove oldest
    }

    await user.save();
    res.json({ message: 'Added to recently viewed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
