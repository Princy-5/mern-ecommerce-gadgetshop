// controllers/productController.js
const Product = require('../models/Product');

// ✅ GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    filter.inStock = true;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const total = await Product.countDocuments(filter);

    return res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('❌ Get products error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while fetching products' 
    });
  }
};

// ✅ GET SINGLE PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('❌ Get product error:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Server error while fetching product' 
    });
  }
};

// ✅ CREATE PRODUCT (Admin)
exports.createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    const product = new Product(productData);
    await product.save();

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (err) {
    console.error('❌ Create product error:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    return res.status(500).json({ 
      success: false,
      message: 'Server error while creating product' 
    });
  }
};