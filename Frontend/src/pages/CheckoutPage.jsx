// src/pages/CheckoutPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

export default function CheckoutPage({ cart, user }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/", { state: { from: "/checkout" } });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="loading-message">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  const subtotal = (cart || []).reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    alert("🎉 Order placed successfully! Thank you for your purchase.");
    // Here you would typically clear the cart and redirect to order confirmation
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h2>Checkout</h2>
        
        {(!cart || cart.length === 0) ? (
          <div className="empty-checkout">
            <div className="empty-icon">📦</div>
            <p>Your cart is empty</p>
            <button 
              onClick={() => navigate("/products")} 
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="checkout-content">
            <div className="checkout-items">
              <h3>Order Summary</h3>
              {cart.map(it => (
                <div key={it.id} className="checkout-item">
                  <img src={it.image} alt={it.name} className="checkout-item-image" />
                  <div className="checkout-item-details">
                    <h4>{it.name}</h4>
                    <p>Quantity: {it.qty}</p>
                    <p className="item-price">₹{it.price} each</p>
                    <p className="item-subtotal">Subtotal: ₹{(it.price * it.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-summary">
              <h3>Order Details</h3>
              
              <div className="summary-section">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="shipping-info">
                <h4>Shipping Information</h4>
                <div className="shipping-details">
                  <p><strong>{user.name}</strong></p>
                  <p>{user.email}</p>
                  <p>123 Shipping Address</p>
                  <p>City, State 12345</p>
                  <p>India</p>
                </div>
              </div>

              <div className="payment-method">
                <h4>Payment Method</h4>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" defaultChecked />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>UPI Payment</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="place-order-btn"
              >
                Place Order - ₹{total.toFixed(2)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}