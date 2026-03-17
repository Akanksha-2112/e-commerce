import passport from 'passport';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const GoogleStrategy = require('passport-google-oauth20').Strategy;
import User from '../models/User.js';

// Google OAuth Strategy - Only configure if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://e-commerce-2e5z.onrender.com/api/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // User exists, return user
                        return done(null, user);
                    }

                    // Create new user
                    user = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        emailVerified: true, // Google emails are verified
                        profilePicture: {
                            url: profile.photos[0]?.value || '',
                            public_id: ''
                        },
                        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) // Random password for OAuth users
                    });

                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
    console.log('✓ Google OAuth configured');
} else {
    console.warn('⚠ Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
