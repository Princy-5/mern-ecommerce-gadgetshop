// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');
const mongoose = require('mongoose');

// Helper function to find query
const findQuery = (req) => {
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || req.body.guestId || null;
  
  if (userId) return { userId };
  if (guestId) return { guestId };
  return null;
};

// Helper function to find or create wishlist
async function findOrCreateWishlist(query) {
  let wishlist = await Wishlist.findOne(query).populate('items');
  
  if (!wishlist) {
    wishlist = new Wishlist(query);
    await wishlist.save();
  }
  
  return wishlist;
}

// ✅ GET WISHLIST - Fixed
exports.getWishlist = async (req, res) => {
  try {
    const q = findQuery(req);
    
    if (!q) {
      return res.json({ 
        success: true,
        wishlist: [] 
      });
    }

    const wishlist = await findOrCreateWishlist(q);
    
    return res.json({
      success: true,
      wishlist: wishlist.items || []
    });
  } catch (err) {
    console.error('❌ Get wishlist error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while fetching wishlist' 
    });
  }
};

// ✅ TOGGLE WISHLIST - Fixed
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId, guestId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false,
        message: 'Product ID is required' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID format' 
      });
    }

    const q = findQuery(req);
    if (!q) {
      return res.status(400).json({ 
        success: false,
        message: 'User must be logged in or provide guestId' 
      });
    }

    let wishlist = await Wishlist.findOne(q);
    
    if (!wishlist) {
      // Create new wishlist
      wishlist = new Wishlist({
        ...q,
        items: [productId]
      });
    } else {
      // Toggle product in wishlist
      const productIndex = wishlist.items.findIndex(
        item => item.toString() === productId
      );

      if (productIndex > -1) {
        // Remove from wishlist
        wishlist.items.splice(productIndex, 1);
      } else {
        // Add to wishlist
        wishlist.items.push(productId);
      }
    }

    wishlist.lastUpdated = new Date();
    await wishlist.save();
    await wishlist.populate('items');

    const action = wishlist.items.some(item => item._id.toString() === productId) 
      ? 'added to' 
      : 'removed from';

    return res.json({
      success: true,
      message: `Product ${action} wishlist successfully`,
      wishlist: wishlist.items
    });
  } catch (err) {
    console.error('❌ Toggle wishlist error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while updating wishlist' 
    });
  }
};

// ✅ REMOVE FROM WISHLIST - Fixed
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false,
        message: 'Product ID is required' 
      });
    }

    const q = findQuery(req);
    if (!q) {
      return res.status(400).json({ 
        success: false,
        message: 'User must be logged in or provide guestId' 
      });
    }

    const wishlist = await Wishlist.findOne(q);
    if (!wishlist) {
      return res.status(404).json({ 
        success: false,
        message: 'Wishlist not found' 
      });
    }

    // Remove product from wishlist
    wishlist.items = wishlist.items.filter(
      item => item.toString() !== productId
    );

    wishlist.lastUpdated = new Date();
    await wishlist.save();
    await wishlist.populate('items');

    return res.json({
      success: true,
      message: 'Product removed from wishlist successfully',
      wishlist: wishlist.items
    });
  } catch (err) {
    console.error('❌ Remove from wishlist error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while removing from wishlist' 
    });
  }
};