const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const { limiter, helmetConfig } = require('./middleware/securityMiddleware');

// Load environment variables early
dotenv.config();

const app = express();

// Initialize essential middleware first
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply security middleware
app.use(helmetConfig);
app.use(limiter);

// CORS Configuration from environment
const allowedOrigins = [
    process.env.CORS_ORIGIN, // Production frontend URL
    'http://localhost:5173', // Vite development server
    'http://localhost:3000'  // Alternative local development port
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests, etc)
        if (!origin) {
            return callback(null, true);
        }
        
        // Check if the origin is allowed
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`Blocked request from unauthorized origin: ${origin}`);
            console.warn('Allowed origins:', allowedOrigins);
            callback(new Error(`Origin '${origin}' not allowed by CORS. Allowed origins: ${allowedOrigins.join(', ')}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 204,
    maxAge: 86400 // 24 hours
};

// Apply CORS configuration
app.use(cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  console.log('Request Method:', req.method);
  console.log('Request Path:', req.path);
  next();
});

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// MongoDB Connection with retry logic (clean, non-deprecated options)
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set. Set MONGO_URI in your environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000 // 10s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:');
    console.error(error);

    // Common cause: IP not whitelisted in Atlas. Add Render's outbound IPs or allow access from anywhere (0.0.0.0/0) temporarily.
    if (error.message && error.message.match(/ECONNREFUSED|failed to connect|could not connect|no primary/ig)) {
      console.error('🔎 Hint: This often means your Atlas cluster is not accessible from this server.');
      console.error('Visit https://account.mongodb.com/ to add your deployment IP(s) in Network Access or allow 0.0.0.0/0 temporarily for testing.');
    }

    // Retry connection after 5 seconds
    console.log('⏳ Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Start connection
connectDB();

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// Health check route with debug info
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    debug: {
      origin: req.headers.origin,
      host: req.headers.host,
      environment: process.env.NODE_ENV,
      allowedOrigins: corsOptions.origin.toString(),
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  // Handle MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate key error',
        field: Object.keys(err.keyPattern)[0]
      });
    }
  }

  // Default error response
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
