// src/components/Hero.jsx
import React from 'react';
import "./Hero.css";
import { useNavigate } from "react-router-dom";

function Hero({ onShopNow }) {
  const navigate = useNavigate();

  const features = [
    { icon: "🚚", text: "Free Shipping Over ₹1000" },
    { icon: "🛡️", text: "Secure Payment" },
    { icon: "↩️", text: "Easy Returns" },
    { icon: "📞", text: "24/7 Support" }
  ];

  const handleShopNow = () => {
    if (onShopNow) {
      onShopNow();
    } else {
      navigate("/products");
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            Welcome to <span className="brand-accent">Gadget</span>Shop
          </h1>
          <p className="hero-description">
            Your one-stop destination for trendy and affordable tech products! 
            Discover the latest gadgets, accessories, and cutting-edge technology 
            at unbeatable prices.
          </p>
          
          <div className="hero-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <button className="btn-primary large" onClick={handleShopNow}>
              🛍️ Shop Now
            </button>
            <button 
              className="btn-secondary large"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              🔍 Explore Products
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Brands</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-products">
            <div className="product-item watch">⌚</div>
            <div className="product-item buds">🎧</div>
            <div className="product-item speaker">🔊</div>
            <div className="product-item phone">📱</div>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  );
}

export default Hero;