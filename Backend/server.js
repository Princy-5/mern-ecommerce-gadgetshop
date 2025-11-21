require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();

// CORS configuration
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true 
}));

app.use(express.json());

// ✅ ADD THIS: Debug middleware to log all API requests
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('📦 Request body:', req.body);
  }
  next();
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'GadgetShop Backend is running!', 
    timestamp: new Date().toISOString() 
  });
});

// Simple 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection with better error handling for Atlas
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('Please check:');
    console.log('1. Your MongoDB Atlas connection string');
    console.log('2. Internet connection');
    console.log('3. IP whitelist in MongoDB Atlas');
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 MongoDB: Atlas Cluster`);
    console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
    console.log('🔍 Debug mode: ON - All requests will be logged');
  });
}).catch(err => {
  console.error('❌ Failed to start server:', err);
});