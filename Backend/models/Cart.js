// models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1,
    min: [1, 'Quantity cannot be less than 1'],
    max: [10, 'Quantity cannot exceed 10']
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    sparse: true
  },
  guestId: { 
    type: String, 
    sparse: true
  },
  items: [cartItemSchema],
  lastUpdated: { type: Date, default: Date.now }
}, { 
  timestamps: true 
});

// Compound index to ensure unique cart for user or guest
cartSchema.index({ userId: 1 }, { unique: true, sparse: true });
cartSchema.index({ guestId: 1 }, { unique: true, sparse: true });
cartSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Auto-delete after 30 days

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

module.exports = mongoose.model('Cart', cartSchema);