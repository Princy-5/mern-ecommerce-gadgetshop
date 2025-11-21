// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_fallback';

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  
  // Allow guests to proceed without authentication
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (user) {
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email
      };
    }
  } catch (err) {
    console.warn("⚠️ Invalid token:", err.message);
    // Don't throw error, just proceed without user (guest mode)
  }
  
  next();
};