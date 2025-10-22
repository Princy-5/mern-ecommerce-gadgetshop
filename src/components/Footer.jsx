
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-text">
        © {new Date().getFullYear()} GadgetShop. All rights reserved.
      </div>
      <div className="socials">
        <a href="#"><img src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" alt="Facebook" /></a>
        <a href="#"><img src="https://img.icons8.com/?size=100&id=6Fsj3rv2DCmG&format=png&color=000000" alt="Twitter" /></a>
        <a href="#"><img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" alt="Instagram" /></a>
      </div>
    </footer>
  );
}

export default Footer;

