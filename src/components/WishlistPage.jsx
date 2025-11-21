// src/components/WishlistPage.jsx - FIXED
import React, { useEffect, useState } from "react";
import { api } from "../api";
import "./WishlistPage.css";

export default function WishlistPage({ wishlist = [], addToCart, toggleWishlist }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and filter by wishlist
  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        if (!mounted) return;
        
        const allProducts = res.data || [];
        const wishlistProducts = allProducts.filter(p => 
          wishlist.includes(p._id) || wishlist.includes(String(p._id))
        );
        
        setProducts(wishlistProducts);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
    
    return () => { mounted = false; };
  }, [wishlist]);

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
      alert("Added to cart!");
    }
  };

  const handleRemoveWishlist = (productId) => {
    if (toggleWishlist) {
      toggleWishlist(productId);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container" style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
        <h2>Your Wishlist</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-container" style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h2>Your Wishlist</h2>
      
      {!products || products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>Your wishlist is empty.</p>
          <p>Add some products to your wishlist to see them here!</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map(p => (
            <div key={p._id || p.id} className="wishlist-card">
              <img 
                src={p.image || "/placeholder.png"} 
                alt={p.name || p.title} 
                onError={(e) => {
                  e.target.src = "/placeholder.png";
                }}
              />
              <h4>{p.name || p.title}</h4>
              <p className="price">₹{p.price || p.price}</p>
              <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                <button 
                  onClick={() => handleAddToCart(p)} 
                  className="btn-primary"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => handleRemoveWishlist(p._id || p.id)} 
                  className="btn-secondary"
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
