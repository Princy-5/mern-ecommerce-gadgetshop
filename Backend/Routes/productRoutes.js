const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// GET all products - PUBLIC
router.get('/', async (req, res) => {
  try {
    console.log('📦 GET /api/products - Fetching all products');
    const products = await Product.find().limit(50);
    console.log(`✅ Found ${products.length} products`);
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single product - PUBLIC
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ FIXED: POST create/update product
router.post('/', async (req, res) => {
  try {
    console.log('📦 POST /api/products - Received data:', req.body);
    
    const { _id, name, price, image, description, category } = req.body;
    
    // Validate required fields
    if (!name || !price || !image) {
      return res.status(400).json({ 
        message: 'Name, price, and image are required' 
      });
    }

    let product;
    
    if (_id) {
      // Update existing product
      console.log(`🔄 Updating product with ID: ${_id}`);
      product = await Product.findByIdAndUpdate(
        _id,
        {
          name,
          price: Number(price),
          image,
          description: description || '',
          category: category || 'electronics'
        },
        { new: true, runValidators: true }
      );
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      console.log('✅ Product updated successfully:', product);
      res.json({
        success: true,
        message: 'Product updated successfully',
        product
      });
    } else {
      // Create new product
      console.log('🆕 Creating new product');
      product = new Product({
        name,
        price: Number(price),
        image,
        description: description || '',
        category: category || 'electronics'
      });
      
      await product.save();
      console.log('✅ Product created successfully:', product);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product
      });
    }
    
  } catch (err) {
    console.error('❌ Error creating/updating product:', err);
    res.status(500).json({ 
      message: 'Server error: ' + err.message 
    });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('Error updating product', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    console.log(`🗑️ DELETE /api/products/${req.params.id}`);
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('✅ Product deleted successfully');
    res.json({ 
      success: true,
      message: 'Product deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting product', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;