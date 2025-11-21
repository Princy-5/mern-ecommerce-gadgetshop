import React, { useState, useEffect } from 'react';
import { api } from '../api';
import './AdminPanel.css';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'electronics'
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = ['electronics', 'wearables', 'audio', 'accessories', 'computing'];

  // Fetch all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🔍 Fetching products...');
      const response = await api.get('/products');
      console.log('✅ Products fetched:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setMessage('❌ Error loading products: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        image: formData.image,
        description: formData.description,
        category: formData.category
      };

      console.log('📦 Sending product data:', productData);

      if (editingProduct) {
        // ✅ UPDATE: Use POST with _id (your backend expects this)
        productData._id = editingProduct._id;
        const response = await api.post('/products', productData);
        console.log('✅ Product updated:', response.data);
        setMessage('✅ Product updated successfully!');
      } else {
        // ✅ CREATE: Use POST without _id
        const response = await api.post('/products', productData);
        console.log('✅ Product created:', response.data);
        setMessage('✅ Product added successfully!');
      }

      // Reset form and refresh
      setFormData({
        name: '',
        price: '',
        image: '',
        description: '',
        category: 'electronics'
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('❌ API Error:', error);
      console.log('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        url: error.config?.url
      });
      setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      description: product.description || '',
      category: product.category
    });
    setEditingProduct(product);
    setMessage('');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting product:', productId);
      await api.delete(`/products/${productId}`);
      // Update local state
      setProducts(prev => prev.filter(p => p._id !== productId));
      setMessage('✅ Product deleted successfully!');
    } catch (error) {
      console.error('❌ Delete Error:', error);
      setMessage('❌ Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: '',
      price: '',
      image: '',
      description: '',
      category: 'electronics'
    });
    setEditingProduct(null);
    setMessage('');
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>📦 Product Management Panel</h2>
        <p>Add and manage products for your store</p>
      </div>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="admin-content">
        <div className="form-section">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="Enter price"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Image URL *</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              {editingProduct && (
                <button type="button" onClick={cancelEdit} className="btn-cancel">
                  Cancel Edit
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </form>
        </div>

        <div className="products-section">
          <h3>Existing Products ({products.length})</h3>
          <div className="products-list">
            {products.length === 0 ? (
              <div className="no-products">
                <p>No products found. Add your first product above!</p>
              </div>
            ) : (
              products.map(product => (
                <div key={product._id} className="admin-product-card">
                  <img src={product.image} alt={product.name} className="product-img" />
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p className="price">₹{product.price}</p>
                    <p className="category">{product.category}</p>
                  </div>
                  <div className="product-actions">
                    <button onClick={() => handleEdit(product)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;