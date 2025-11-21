// models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    sparse: true
  },
  guestId: { 
    type: String, 
    sparse: true
  },
  items: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  lastUpdated: { type: Date, default: Date.now }
}, { 
  timestamps: true 
});

// Compound indexes
wishlistSchema.index({ userId: 1 }, { unique: true, sparse: true });
wishlistSchema.index({ guestId: 1 }, { unique: true, sparse: true });
wishlistSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Auto-delete after 30 days

module.exports = mongoose.model('Wishlist', wishlistSchema);