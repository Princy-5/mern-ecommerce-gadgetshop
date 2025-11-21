// src/components/About.jsx
import React, { useState } from "react";
import "./About.css";

const faqData = [
  {
    question: "What is GadgetShop?",
    answer: "GadgetShop is an innovative e-commerce platform offering a wide range of quality tech products at the best prices. We're committed to bringing you the latest technology with exceptional customer service."
  },
  {
    question: "How can I contact support?",
    answer: "You can contact our 24/7 customer support team at support@gadgetshop.com or call us at +91 98765 43210. We typically respond within 2 hours."
  },
  {
    question: "Do you offer returns?",
    answer: "Yes! We offer easy returns within 30 days of purchase. Products must be in original condition with all accessories. Refunds are processed within 5-7 business days."
  },
  {
    question: "What are your delivery options?",
    answer: "We offer standard delivery (3-5 days) and express delivery (1-2 days). Free shipping on orders above ₹1000. We deliver across India."
  },
  {
    question: "Are your products genuine?",
    answer: "Absolutely! We source all our products directly from authorized dealers and manufacturers. Every product comes with official warranty and certification."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we only ship within India. We're working on expanding our services to international locations soon."
  }
];

const teamMembers = [
  {
    name: "Aarav Sharma",
    role: "Founder & CEO",
    image: "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
    description: "Tech enthusiast with 10+ years in e-commerce"
  },
  {
    name: "Priya Patel",
    role: "Head of Operations",
    image: "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
    description: "Ensuring smooth operations and customer satisfaction"
  },
  {
    name: "Rohan Mehta",
    role: "Tech Lead",
    image: "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg",
    description: "Building the future of tech shopping experience"
  }
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="about-section" id="about">
      <div className="about-hero">
        <h2>About GadgetShop</h2>
        <p>Your trusted partner in technology since 2022</p>
      </div>

      <div className="about-content">
        <div className="about-text">
          <h3>Our Story</h3>
          <p>
            Founded in 2022, GadgetShop started as a small passion project to make quality tech 
            accessible to everyone. Today, we've grown into a trusted e-commerce platform serving 
            thousands of customers across India with the latest gadgets and tech accessories.
          </p>
          
          <div className="mission-vision">
            <div className="mission">
              <h4>🎯 Our Mission</h4>
              <p>To make cutting-edge technology accessible and affordable for everyone, while providing exceptional customer service and support.</p>
            </div>
            <div className="vision">
              <h4>🔮 Our Vision</h4>
              <p>To become India's most trusted destination for tech enthusiasts and gadget lovers.</p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="gallery-main">
            <img 
              src="https://www.magalieshillsshoppingcentre.co.za/wp-content/uploads/2022/08/The_Gadget-shot-1024x812.jpg" 
              alt="Our Gadget Store" 
            />
          </div>
          <div className="gallery-side">
            <img 
              src="https://img.freepik.com/premium-photo/view-gadget-stores-display-with-various-smart-home-devices-tech-accessories_1314467-12438.jpg" 
              alt="Product Collection" 
            />
            <img 
              src="https://img.freepik.com/photos-premium/gadgets-futuristes-presentez-gamme-appareils-technologiques-elegants-modernes_977107-683.jpg?w=996" 
              alt="Latest Technology" 
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section">
        <h3>Meet Our Team</h3>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.image} alt={member.name} />
              <h4>{member.name}</h4>
              <p className="role">{member.role}</p>
              <p className="description">{member.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="values-section">
        <h3>Why Choose GadgetShop?</h3>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🚚</div>
            <h4>Fast Delivery</h4>
            <p>Get your orders delivered quickly with our reliable shipping partners across India</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🛡️</div>
            <h4>Secure Shopping</h4>
            <p>Your data and payments are protected with advanced security measures</p>
          </div>
          <div className="value-card">
            <div className="value-icon">⭐</div>
            <h4>Quality Assured</h4>
            <p>All products are genuine and come with manufacturer warranty</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💬</div>
            <h4>24/7 Support</h4>
            <p>Our customer support team is always here to help you</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💰</div>
            <h4>Best Prices</h4>
            <p>Competitive pricing with regular discounts and special offers</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🔄</div>
            <h4>Easy Returns</h4>
            <p>Hassle-free returns within 30 days of purchase</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-container">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAnswer(index)}
            >
              <div className="faq-question">
                <span>{item.question}</span>
                <span className="faq-toggle">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;