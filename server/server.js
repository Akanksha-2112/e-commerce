import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import passport from './config/passport.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate critical environment variables
console.log('🔍 Checking environment variables...');
console.log('✓ MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : '❌ Missing');
console.log('✓ JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : '❌ Missing');
console.log('✓ CLIENT_URL:', process.env.CLIENT_URL || 'Using default: http://localhost:3000');

// Connect to Database
connectDB();

// Trust proxy for rate limiters behind Render load balancer
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:3000', /\.vercel\.app$/],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // FIX: automatically use secure cookies in production
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Make passport available to routes
app.set('passport', passport);

// Serve static files from uploads directory
// FIX: moved above app.listen() so it's registered before the server starts
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error Handler Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log('='.repeat(50) + '\n');
});
