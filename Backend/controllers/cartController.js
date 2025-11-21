// controllers/cartController.js
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Helper function to find or create cart
async function findOrCreateCart({ userId, guestId }) {
  try {
    if (!userId && !guestId) {
      throw new Error('Either userId or guestId is required');
    }

    const query = userId ? { userId } : { guestId };
    
    let cart = await Cart.findOne(query).populate('items.productId');
    
    if (!cart) {
      cart = new Cart(query);
      await cart.save();
      await cart.populate('items.productId');
    }

    return cart;
  } catch (error) {
    console.error('Error in findOrCreateCart:', error);
    throw error;
  }
}

// GET CART
exports.getCart = async (req, res) => {
  try {
    const guestId = req.query.guestId;
    const userId = req.user?.id;

    if (!userId && !guestId) {
      return res.json({ items: [] });
    }

    const cart = await findOrCreateCart({ userId, guestId });
    return res.json(cart);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD ITEM TO CART
exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, guestId } = req.body;
    const userId = req.user?.id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID required' });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid productId format' });
    }

    const qty = parseInt(quantity) || 1;
    
    const cart = await findOrCreateCart({ userId, guestId });
    
    const existingItemIndex = cart.items.findIndex(
      item => item.productId._id.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();
    await cart.populate('items.productId');
    
    res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// REMOVE ITEM FROM CART
exports.removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const guestId = req.query.guestId;
    const userId = req.user?.id;

    const cart = await findOrCreateCart({ userId, guestId });
    
    cart.items = cart.items.filter(
      item => item.productId._id.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.productId');
    
    res.json(cart);
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const guestId = req.query.guestId;
    const userId = req.user?.id;

    const cart = await findOrCreateCart({ userId, guestId });
    cart.items = [];
    await cart.save();
    
    res.json({ message: 'Cart cleared', items: [] });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// REPLACE CART
exports.replaceCart = async (req, res) => {
  try {
    const { cart: newCartItems, guestId } = req.body;
    const queryGuestId = req.query.guestId;
    const userId = req.user?.id;

    if (!Array.isArray(newCartItems)) {
      return res.status(400).json({ message: 'Cart array required' });
    }

    const finalGuestId = guestId || queryGuestId;
    
    let cartDoc = await findOrCreateCart({ userId, guestId: finalGuestId });
    
    cartDoc.items = newCartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity || 1
    }));

    await cartDoc.save();
    await cartDoc.populate('items.productId');
    
    res.json(cartDoc);
  } catch (err) {
    console.error('Replace cart error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};