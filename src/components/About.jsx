import React, { useState } from "react";
import "./About.css";

const faqData = [
  {
    question: "What is GadgetShop?",
    answer: "GadgetShop is an innovative e-commerce platform offering a wide range of quality tech products at the best prices."
  },
  {
    question: "How can I contact support?",
    answer: "You can contact us anytime at support@gadgetshop.com."
  },
  {
    question: "Do you offer returns?",
    answer: "Yes! We offer easy returns within 30 days of purchase."
  }
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="about-section" id="about">

      <h3 className="about-title">About Us</h3>

      {/* 3 Image Row */}
      <div className="image-row">
        <img src="https://www.magalieshillsshoppingcentre.co.za/wp-content/uploads/2022/08/The_Gadget-shot-1024x812.jpg" alt="Tech 1" />
        <img src="https://img.freepik.com/premium-photo/view-gadget-stores-display-with-various-smart-home-devices-tech-accessories_1314467-12438.jpg" alt="Tech 2" />
        <img src="https://img.freepik.com/photos-premium/gadgets-futuristes-presentez-gamme-appareils-technologiques-elegants-modernes_977107-683.jpg?w=996" alt="Tech 3" />
      </div>

      {/* About Text */}
      <div className="about-content">
        <p>GadgetShop is your one-stop shop for trending tech gadgets and accessories.</p>
        <ul>
          <li>🛒 Wide range of high-quality tech products.</li>
          <li>💰 Competitive prices and special offers.</li>
          <li>🚚 Fast and reliable delivery.</li>
          <li>📞 Excellent 24/7 customer support.</li>
          <li>🔄 Easy returns and hassle-free refunds.</li>
          <li>🌟 Curated products for tech enthusiasts.</li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item" onClick={() => toggleAnswer(index)}>
            <div className="faq-question">
              <span>{item.question}</span>
              <span className="faq-toggle">{activeIndex === index ? "−" : "+"}</span>
            </div>
            {activeIndex === index && <div className="faq-answer">{item.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;

