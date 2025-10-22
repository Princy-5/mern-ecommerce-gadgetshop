import React from 'react';
import  "./Newsletter.css";

function Newsletter() {
  return (
    <section id="newsletter">
      <h3>Subscribe to Our Newsletter</h3>
      <p>Get the latest updates on new gadgets and exclusive deals!</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
     
      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ⬆️ Top
      </button>
    </section>
  );
}

export default Newsletter;


