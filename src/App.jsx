import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import About from './components/About';
import Contact from './components/Contact';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import CartPage from './components/CartPage';
import './App.css';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    alert(`${item.name} added to cart!`);
  };

  return (
    <Router>
      <div className="container">
        <Header
          cart={cart.length}
          setShowLogin={setShowLogin}
          setShowSignup={setShowSignup}
          showLogin={showLogin}
          showSignup={showSignup}
        />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <ProductList
                  addToCart={addToCart}
                  search={search}
                  setSearch={setSearch}
                />
                <About />
                <Contact />
                <Newsletter />
              </>
            }
          />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        </Routes>

        {/* ✅ Footer moved here so it's shown on all pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

