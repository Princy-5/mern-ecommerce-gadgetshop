// src/components/Contact.jsx
import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

  const contactMethods = [
    {
      icon: "📞",
      title: "Phone",
      details: "+91 98765 43210",
      description: "Mon to Sun 9AM to 9PM"
    },
    {
      icon: "✉️",
      title: "Email",
      details: "support@gadgetshop.com",
      description: "Send us your query anytime"
    },
    {
      icon: "📍",
      title: "Address",
      details: "Tech Park, Sector 62",
      description: "Chennai, Tamil Nadu 623707"
    },
    {
      icon: "🕒",
      title: "Working Hours",
      details: "24/7 Support",
      description: "Customer service always available"
    }
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="contact-hero">
        <h2>Contact Us</h2>
        <p>Get in touch with our team - we're here to help!</p>
      </div>

      <div className="contact-container">
        {/* Contact Information */}
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p className="contact-description">
            Have questions about our products or need assistance with your order? 
            Our friendly support team is here to help you.
          </p>
          
          <div className="contact-methods">
            {contactMethods.map((method, index) => (
              <div key={index} className="contact-method">
                <div className="method-icon">{method.icon}</div>
                <div className="method-details">
                  <h4>{method.title}</h4>
                  <p className="method-main">{method.details}</p>
                  <p className="method-desc">{method.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="social-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">📘 Facebook</a>
              <a href="#" className="social-link">📷 Instagram</a>
              <a href="#" className="social-link">🐦 Twitter</a>
              <a href="#" className="social-link">💼 LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-container">
          <h3>Send us a Message</h3>
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h4>Thank You!</h4>
              <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary large"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <h3>Find Us</h3>
        <div className="map-placeholder">
          <div className="map-content">
            <h4>📍 Our Location</h4>
            <p>Tech Park, Sector 62, Chennai</p>
            <p>Tamil Nadu 623707, India</p>
            <button className="btn-secondary">Get Directions</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;