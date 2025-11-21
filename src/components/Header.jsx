// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ cartCount = 0, user, onLogout, openAuth }) {
  const navigate = useNavigate();

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-left" onClick={() => navigate("/")}>
          <div className="logo-icon">⚡</div>
          <div className="brand">
            Gadget<span>Shop</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <a onClick={() => navigate("/")} className="nav-link">Home</a>
          <a onClick={() => navigate("/products")} className="nav-link">Products</a>
          <a onClick={() => navigate("/about")} className="nav-link">About</a>
          <a onClick={() => navigate("/contact")} className="nav-link">Contact</a>
        </nav>

        {/* Right Section */}
        <div className="header-right">
          {/* Wishlist Button */}
          <button 
            className="icon-btn wishlist-btn" 
            title="Wishlist" 
            onClick={() => navigate("/wishlist")}
          >
            ♡
          </button>

          {/* Cart Button */}
          <div className="cart-icon-container">
            <button 
              className="icon-btn cart-btn" 
              title="Cart" 
              onClick={() => navigate("/cart")}
            >
              🛒
            </button>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </div>

          {/* Auth Buttons */}
          {!user ? (
            <div className="auth-buttons">
              <button 
                className="btn login-btn" 
                onClick={() => openAuth("login")}
              >
                Login
              </button>
              <button 
                className="btn signup-btn" 
                onClick={() => openAuth("signup")}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="user-section">
              <div className="user-greet">Hi, {user.name}</div>
              {/* Admin Button - Only show for admin users */}
              {isAdmin && (
                <button 
                  className="btn admin-btn" 
                  onClick={() => navigate("/admin")}
                  title="Admin Panel"
                >
                  ⚙️ Admin
                </button>
              )}
              <button 
                className="btn logout-btn" 
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;