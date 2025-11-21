const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String
});

const Product = mongoose.model('Product', productSchema);

const products = [
  {
    name: "Smart Watch Series 5",
    price: 2499,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    description: "Advanced smartwatch with health monitoring, GPS, and 7-day battery life",
    category: "wearables"
  },
  {
    name: "Wireless Earbuds Pro",
    price: 1999,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
    description: "True wireless earbuds with active noise cancellation and 30hr battery",
    category: "audio"
  },
  {
    name: "Bluetooth Speaker X1",
    price: 1499,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    description: "Portable Bluetooth speaker with 360° sound and IPX7 waterproof rating",
    category: "audio"
  },
  {
    name: "Fitness Band Pro",
    price: 1799,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400",
    description: "Fitness tracker with heart rate monitor, SpO2 sensor, and 10-day battery",
    category: "wearables"
  },
  {
    name: "Smartphone Case Ultra",
    price: 499,
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=400",
    description: "Premium protective case with military-grade drop protection",
    category: "accessories"
  },
  {
    name: "Wireless Mouse Pro",
    price: 699,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    description: "Ergonomic wireless mouse with precision tracking and silent clicks",
    category: "computing"
  },
  {
    name: "Power Bank 20000mAh",
    price: 1199,
    image: "https://images.unsplash.com/photo-1609592810794-3c1b5fb0c7b9?w=400",
    description: "High-capacity power bank with fast charging and multiple ports",
    category: "accessories"
  },
  {
    name: "Gaming Keyboard RGB",
    price: 2499,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
    description: "Mechanical gaming keyboard with RGB lighting and programmable keys",
    category: "computing"
  }
  
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log(`🌱 Seeded ${products.length} products successfully`);

    // Verify products
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();