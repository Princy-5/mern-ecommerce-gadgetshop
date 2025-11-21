// backend/middleware/adminMiddleware.js
const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. Please login.' 
      });
    }

    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error in admin verification' 
    });
  }
};