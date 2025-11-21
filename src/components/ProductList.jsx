// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import "./ProductList.css";
import { api } from "../api";

export default function ProductList({ addToCart, wishlist = [], toggleWishlist }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "all", label: "All Products" },
    { value: "wearables", label: "Wearables" },
    { value: "audio", label: "Audio" },
    { value: "accessories", label: "Accessories" },
    { value: "computing", label: "Computing" }
  ];

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  // Fallback image function
  const getFallbackImage = (category) => {
    const fallbackImages = {
      wearables: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      audio: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e0?w=400",
      accessories: "https://images.unsplash.com/photo-1601593346740-925612772716?w=400",
      computing: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
      default: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhGQUZDIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE1MCAyMDBIMjUwTDIwMCAxNTBaIiBmaWxsPSIjN0RDM0ZDIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NDc0OEIiPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+"
    };
    
    return fallbackImages[category] || fallbackImages.default;
  };

  if (loading) {
    return (
      <section id="products" className="product-section">
        <div className="product-header">
          <h3>Featured Products</h3>
          <div className="loading-spinner">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="product-section">
      <div className="product-header">
        <h3>Featured Products</h3>
        <p>Discover the latest gadgets and tech accessories</p>
        
        <div className="product-controls">
          <input
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {(search || category !== "all") && (
            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
            {(search || category !== "all") && (
              <button onClick={handleClearFilters} className="btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map(product => {
            const productId = product._id || product.id;
            const inWish = wishlist.includes(productId);
            
            return (
              <div key={productId} className="product-card">
                <button
                  className={`wish-btn ${inWish ? "active" : ""}`}
                  onClick={() => toggleWishlist && toggleWishlist(productId)}
                  title={inWish ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {inWish ? "♥" : "♡"}
                </button>

                <div className="img-wrap">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = getFallbackImage(product.category);
                    }}
                    loading="lazy"
                  />
                </div>

                <div className="card-body">
                  <h4>{product.name}</h4>
                  <p className="product-description">
                    {product.description || "Premium quality product"}
                  </p>
                  
                  <div className="product-meta">
                    <p className="price">₹{product.price}</p>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn-add" 
                      onClick={() => {
                        addToCart(product);
                        alert(`${product.name} added to cart!`);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}