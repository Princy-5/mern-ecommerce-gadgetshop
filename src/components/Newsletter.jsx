// src/components/Newsletter.jsx
import React, { useState } from "react";
import "./Newsletter.css";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail("");
      
      // Reset after 5 seconds
      setTimeout(() => setSubscribed(false), 5000);
    }, 1500);
  };

  const benefits = [
    "🎁 Exclusive discounts and offers",
    "🚀 Early access to new products",
    "💡 Tech tips and tutorials",
    "⭐ Member-only sales events"
  ];

  return (
    <section id="newsletter" className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <h3>Stay Updated with GadgetShop</h3>
          <p className="newsletter-description">
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive deals, and tech innovations!
          </p>

          <div className="newsletter-benefits">
            <h4>As a subscriber, you'll get:</h4>
            <ul>
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          {subscribed ? (
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <h4>Welcome to the GadgetShop Family!</h4>
              <p>Thank you for subscribing. Check your email for a welcome gift!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="newsletter-input"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="newsletter-btn"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                </button>
              </div>
              <p className="privacy-note">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>

        <div className="newsletter-image">
          <div className="image-placeholder">
            <div className="floating-icon">📱</div>
            <div className="floating-icon">🎧</div>
            <div className="floating-icon">⌚</div>
            <div className="floating-icon">💻</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;