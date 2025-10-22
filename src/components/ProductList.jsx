import React from 'react';
import  "./ProductList.css";

import smartwatch from '../assets/image/smartwatch.jpg';
import buds from '../assets/image/buds.jpg';
import blutooth from '../assets/image/blutooth.jpg';
import band from '../assets/image/fitness band.jpg';
import cover from '../assets/image/cover.jpg';
import mouse from '../assets/image/mouse.jpg';
import powerbank from '../assets/image/Powerbank.jpg';
import key from '../assets/image/key.jpg';

const products = [
  { id: 1, name: "Smart Watch", price: 2499, image: smartwatch },
  { id: 2, name: "Wireless Earbuds", price: 1999, image: buds },
  { id: 3, name: "Bluetooth Speaker", price: 1499, image: blutooth },
  { id: 4, name: "Fitness Band", price: 1799, image: band },
  { id: 5, name: "Smartphone Case", price: 499, image: cover },
  { id: 6, name: "Wireless Mouse", price: 699, image: mouse },
  { id: 7, name: "Power Bank", price: 1199, image: powerbank },
  { id: 8, name: "Gaming Keyboard", price: 2499, image: key },
];

function ProductList({ addToCart, search, setSearch }) {
  return (
    <section id="products">
      <h3>Products</h3>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <div className="product-list">
        {products
          .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
          .map(p => (
            <div key={p.id} className="product-card">
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
             <button onClick={() => addToCart(p)}>Add to Cart</button>

            </div>
          ))}
      </div>
    </section>
  );
}

export default ProductList;

