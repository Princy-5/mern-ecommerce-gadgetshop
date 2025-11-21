// src/components/CartPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage({ cartItems = [], setCart, updateQty, removeFromCart, clearCart }) {
  const navigate = useNavigate();

  const handleDecrease = (id, qty) => {
    const newQty = Math.max(0, (qty || 1) - 1);
    if (updateQty) updateQty(id, newQty);
    if (setCart) setCart(prev => newQty === 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
  };

  const handleIncrease = (id, qty) => {
    const newQty = (qty || 1) + 1;
    if (updateQty) updateQty(id, newQty);
    if (setCart) setCart(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
  };

  const handleRemove = (id) => {
    if (removeFromCart) removeFromCart(id);
    if (setCart) setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleClear = () => {
    if (clearCart) clearCart();
    if (setCart) setCart([]);
  };

  const total = (cartItems || []).reduce((s, it) => s + ((it.price || 0) * (it.qty || 1)), 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>Your Shopping Cart</h2>
        
        {(!cartItems || cartItems.length === 0) ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <p>Your cart is empty</p>
            <button 
              onClick={() => navigate("/products")} 
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(it => (
                <div key={it.id} className="cart-item">
                  <div className="item-image">
                    <img src={it.image} alt={it.name} />
                  </div>
                  
                  <div className="item-details">
                    <h4>{it.name}</h4>
                    <p className="item-price">₹{it.price}</p>
                    
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleDecrease(it.id, it.qty)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{it.qty}</span>
                      <button 
                        onClick={() => handleIncrease(it.id, it.qty)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      onClick={() => handleRemove(it.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="total-section">
                <h3>Total: ₹{total}</h3>
                <p>Free shipping on orders over ₹1000</p>
              </div>
              
              <div className="cart-actions">
                <button 
                  onClick={() => navigate("/checkout")} 
                  className="checkout-btn"
                >
                  Proceed to Checkout
                </button>
                <button 
                  onClick={handleClear} 
                  className="clear-btn"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}