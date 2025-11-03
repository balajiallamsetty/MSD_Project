const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();


const app = express();

// Trust proxy (for rate limit & IPs behind Render/NGINX)
app.set('trust proxy', 1);

// Core middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use(
  helmet({
    // Keep CSP off unless you configure all sources explicitly
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS
const parseOrigins = (val) =>
  (val || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const allowedOrigins = [
  ...parseOrigins(process.env.CORS_ORIGIN),
  'http://localhost:5173',
  'http://localhost:3000',
  'https://msd-project-five.vercel.app'
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // mobile apps/curl
    if (allowedOrigins.includes(origin)) return cb(null, true);
    console.warn(`Blocked CORS origin: ${origin}`);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Request log (minimal)
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin || 'n/a'}`);
  next();
});

// MongoDB connection with retry
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set. Skipping DB connection.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error?.message || error);
    console.log('⏳ Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Routes
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
    allowedOrigins,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err);
  const status = err.status || 500;
  const payload = { message: err.message || 'Internal Server Error' };
  if (err.name === 'ValidationError') {
    payload.message = 'Validation Error';
    payload.details = Object.values(err.errors || {}).map((e) => e.message);
  }
  if (err.code === 11000) {
    payload.message = 'Duplicate key error';
    payload.field = Object.keys(err.keyPattern || {})[0];
  }
  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
