// src/components/Footer.jsx
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2025 GadgetShop. All rights reserved.</p>
        <div className="footer-icons">
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/7dd3fc/facebook.png" alt="Facebook" /></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/7dd3fc/twitter.png" alt="Twitter" /></a>
          <a href="#"><img src="https://img.icons8.com/ios-filled/50/7dd3fc/instagram.png" alt="Instagram" /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;