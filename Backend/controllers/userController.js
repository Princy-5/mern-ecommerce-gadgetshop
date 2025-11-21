// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_fallback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Email transporter configuration
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('📧 Email credentials not configured - running in development mode');
    return null;
  }

  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// ✅ SIGNUP - Fixed
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields (name, email, password) are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password: hashedPassword 
    });
    
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Signup successful! Welcome to GadgetShop.',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      },
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    return res.status(500).json({ 
      success: false,
      message: 'Server error during signup' 
    });
  }
};

// ✅ LOGIN - Fixed
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// ✅ FORGOT PASSWORD - Fixed
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ 
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    // In development mode, return the reset link
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.json({ 
        success: true,
        message: 'Reset link (development mode)',
        resetLink 
      });
    }

    // Send email in production
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: `"GadgetShop" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request - GadgetShop',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #667eea;">Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: #667eea; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              GadgetShop Team<br>
              Your trusted tech partner
            </p>
          </div>
        `,
      });
    }

    return res.json({ 
      success: true,
      message: 'Password reset email sent successfully. Check your inbox.' 
    });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while processing reset request' 
    });
  }
};

// ✅ RESET PASSWORD - Fixed
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'New password is required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password and clear reset token
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ 
      success: true,
      message: 'Password reset successfully! You can now login with your new password.' 
    });
  } catch (err) {
    console.error('❌ Reset password error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while resetting password' 
    });
  }
  
};