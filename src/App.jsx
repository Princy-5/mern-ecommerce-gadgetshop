// src/App.jsx - COMPLETE FIXED VERSION
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import ProductList from "./components/ProductList";
import CartPage from "./components/CartPage";
import WishlistPage from "./components/WishlistPage";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Contact from "./components/Contact";
import Newsletter from "./components/Newsletter";
import CheckoutPage from "./pages/CheckoutPage";

import { loginUser, signupUser, setAuthToken, forgotPassword, api } from "./api";
import { getOrCreateGuestId } from "./utils/guestId";
import { syncGuestDataAfterLogin } from "./utils/guestSync";
import AdminPanel from './components/AdminPanel';
import "./App.css";

function AppContent() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showForgot, setShowForgot] = useState(false);

  const navigate = useNavigate();

  // INITIAL LOAD: fetch cart & wishlist (user or guest)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    const guestId = getOrCreateGuestId();

    if (token) {
      setAuthToken(token);
      if (u) setUser(JSON.parse(u));
      
      // Fetch user cart and wishlist
      (async () => {
        try {
          const cartRes = await api.get("/cart");
          const mapped = (cartRes.data?.items || []).map(it => ({
            id: it.productId?._id || it.productId,
            name: it.productId?.name || "Product",
            price: it.productId?.price || 0,
            image: it.productId?.image || "",
            qty: it.quantity || 1
          }));
          setCart(mapped);
        } catch (e) {
          console.warn("Fetch server cart failed", e.message);
          // Fallback to localStorage if available
          const localCart = JSON.parse(localStorage.getItem("user_cart") || "[]");
          setCart(localCart);
        }

        try {
          const wres = await api.get("/wishlist");
          setWishlist((wres.data?.wishlist || []).map(p => p._id || p));
        } catch (e) {
          console.warn("Fetch wishlist failed", e.message);
          const localWish = JSON.parse(localStorage.getItem("user_wishlist") || "[]");
          setWishlist(localWish);
        }
      })();
    } else {
      // Guest: fetch guest cart and wishlist
      (async () => {
        try {
          const res = await api.get(`/cart?guestId=${guestId}`);
          const mapped = (res.data?.items || []).map(it => ({
            id: it.productId?._id || it.productId,
            name: it.productId?.name || "Product",
            price: it.productId?.price || 0,
            image: it.productId?.image || "",
            qty: it.quantity || 1
          }));
          setCart(mapped);
        } catch (err) {
          console.warn("Fetch guest cart failed, using localStorage", err.message);
          const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
          setCart(guestCart);
        }

        try {
          const wres = await api.get(`/wishlist?guestId=${guestId}`);
          setWishlist((wres.data?.wishlist || []).map(p => p._id || p));
        } catch (e) {
          console.warn("Fetch guest wishlist failed, using localStorage", e.message);
          const guestWish = JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
          setWishlist(guestWish);
        }
      })();
    }
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Guest: save to guest storage
      localStorage.setItem("guest_cart", JSON.stringify(cart));
      localStorage.setItem("guest_wishlist", JSON.stringify(wishlist));
    } else {
      // User: save to user storage (backup)
      localStorage.setItem("user_cart", JSON.stringify(cart));
      localStorage.setItem("user_wishlist", JSON.stringify(wishlist));
    }
    
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [cart, wishlist, user]);

  // ADD TO CART - FIXED
  const addToCart = async (product) => {
    const id = product.id || product._id;
    const guestId = getOrCreateGuestId();

    if (user) {
      try {
        await api.post("/cart/add", { productId: id, quantity: 1 });
        const res = await api.get("/cart");
        const mapped = (res.data?.items || []).map(it => ({
          id: it.productId?._id || it.productId,
          name: it.productId?.name || "Product",
          price: it.productId?.price || 0,
          image: it.productId?.image || "",
          qty: it.quantity || 1
        }));
        setCart(mapped);
      } catch (err) {
        console.error("Add to server cart error", err);
        // Local fallback for user
        setCart(prev => {
          const idx = prev.findIndex(p => p.id === id);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx].qty = (copy[idx].qty || 1) + 1;
            return copy;
          } else {
            return [...prev, { 
              id, 
              name: product.name, 
              price: product.price, 
              image: product.image, 
              qty: 1 
            }];
          }
        });
      }
    } else {
      // Guest cart
      try {
        await api.post("/cart/add", { productId: id, quantity: 1, guestId });
        const res = await api.get(`/cart?guestId=${guestId}`);
        const mapped = (res.data?.items || []).map(it => ({
          id: it.productId?._id || it.productId,
          name: it.productId?.name || "Product",
          price: it.productId?.price || 0,
          image: it.productId?.image || "",
          qty: it.quantity || 1
        }));
        setCart(mapped);
      } catch (err) {
        console.warn("Guest cart API failed, using local", err.message);
        // Local fallback
        setCart(prev => {
          const idx = prev.findIndex(p => p.id === id);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx].qty = (copy[idx].qty || 1) + 1;
            return copy;
          } else {
            return [...prev, { 
              id, 
              name: product.name, 
              price: product.price, 
              image: product.image, 
              qty: 1 
            }];
          }
        });
      }
    }
  };

  // UPDATE QUANTITY - FIXED
  const updateQtyLocal = (id, qty) => {
    if (qty < 1) {
      removeFromCartLocal(id);
      return;
    }

    if (user) {
      (async () => {
        try {
          // Get current cart from server
          const serverCartRes = await api.get("/cart");
          const serverCart = serverCartRes.data?.items || [];
          
          // Create updated cart array
          const updatedCart = serverCart.map(item => {
            if (item.productId?._id === id || item.productId === id) {
              return { productId: id, quantity: qty };
            }
            return { productId: item.productId?._id || item.productId, quantity: item.quantity };
          });
          
          // If item not in cart, add it
          if (!updatedCart.find(item => item.productId === id)) {
            updatedCart.push({ productId: id, quantity: qty });
          }
          
          await api.post("/cart/replace", { cart: updatedCart });
          
          // Refresh cart
          const refreshed = await api.get("/cart");
          const mapped = (refreshed.data?.items || []).map(it => ({
            id: it.productId?._id || it.productId,
            name: it.productId?.name || "Product",
            price: it.productId?.price || 0,
            image: it.productId?.image || "",
            qty: it.quantity || 1
          }));
          setCart(mapped);
        } catch (err) {
          console.error("Update quantity error:", err);
          // Local fallback
          setCart(prev => prev.map(item => 
            item.id === id ? { ...item, qty } : item
          ));
        }
      })();
    } else {
      setCart(prev => prev.map(item => 
        item.id === id ? { ...item, qty } : item
      ));
    }
  };

  // REMOVE FROM CART - FIXED
  const removeFromCartLocal = (id) => {
    if (user) {
      (async () => {
        try {
          await api.delete(`/cart/remove/${id}`);
          const refreshed = await api.get("/cart");
          const mapped = (refreshed.data?.items || []).map(it => ({
            id: it.productId?._id || it.productId,
            name: it.productId?.name || "Product",
            price: it.productId?.price || 0,
            image: it.productId?.image || "",
            qty: it.quantity || 1
          }));
          setCart(mapped);
        } catch (e) {
          console.error("Remove from cart error:", e);
          // Local fallback
          setCart(prev => prev.filter(item => item.id !== id));
        }
      })();
    } else {
      setCart(prev => prev.filter(item => item.id !== id));
    }
  };

  // CLEAR CART - FIXED
  const clearCartLocal = () => {
    if (user) {
      (async () => {
        try {
          await api.delete("/cart/clear");
          setCart([]);
        } catch (e) {
          console.error("Clear cart error:", e);
          setCart([]);
        }
      })();
    } else {
      setCart([]);
    }
  };

  // TOGGLE WISHLIST - FIXED (No auto auth modal)
  const toggleWishlist = (id) => {
    const guestId = getOrCreateGuestId();
    
    if (!user) {
      // Guest wishlist - don't show auth modal immediately
      (async () => {
        try {
          const res = await api.post("/wishlist/toggle", { productId: id, guestId });
          setWishlist((res.data?.wishlist || []).map(x => x._id || x));
        } catch (err) {
          console.warn("Guest wishlist API failed, using local", err.message);
          const gw = JSON.parse(localStorage.getItem("guest_wishlist") || "[]");
          const index = gw.indexOf(id);
          if (index === -1) {
            gw.push(id);
          } else {
            gw.splice(index, 1);
          }
          localStorage.setItem("guest_wishlist", JSON.stringify(gw));
          setWishlist(gw);
        }
      })();
      return true;
    }

    // User wishlist
    (async () => {
      try {
        const res = await api.post("/wishlist/toggle", { productId: id });
        setWishlist((res.data?.wishlist || []).map(x => x._id || x));
      } catch (err) {
        console.error("Wishlist toggle error", err);
      }
    })();
    return true;
  };

  // AUTH HANDLERS - FIXED
  const handleLogin = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        setAuthToken(data.token);
        setUser(data.user);
        
        // Sync guest data to user account
        await syncGuestDataAfterLogin();
        
        // Fetch updated user data
        try {
          const cartRes = await api.get("/cart");
          const mapped = (cartRes.data?.items || []).map(it => ({
            id: it.productId?._id || it.productId,
            name: it.productId?.name || "Product",
            price: it.productId?.price || 0,
            image: it.productId?.image || "",
            qty: it.quantity || 1
          }));
          setCart(mapped);
        } catch (e) {
          console.warn("Post-login cart fetch failed:", e.message);
        }
        
        try {
          const wres = await api.get("/wishlist");
          setWishlist((wres.data?.wishlist || []).map(p => p._id || p));
        } catch (e) {
          console.warn("Post-login wishlist fetch failed:", e.message);
        }
        
        setShowAuthModal(false);
        return { ok: true };
      }
      return { ok: false, message: data.message };
    } catch (err) {
      return { 
        ok: false, 
        message: err.response?.data?.message || err.message || "Login error" 
      };
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      const data = await signupUser({ name, email, password });
      if (data.token) {
        setAuthToken(data.token);
        setUser(data.user);
        
        // Sync guest data to new user account
        await syncGuestDataAfterLogin();
        
        setShowAuthModal(false);
        return { ok: true };
      }
      return { ok: false, message: data.message };
    } catch (err) {
      return { 
        ok: false, 
        message: err.response?.data?.message || err.message || "Signup error" 
      };
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("user_cart");
    localStorage.removeItem("user_wishlist");
    
    navigate("/");
  };

  const handleForgotSend = async (email) => {
    try {
      const res = await forgotPassword({ email });
      return { 
        ok: true, 
        message: res.message || res.resetLink || "Check your email for reset instructions" 
      };
    } catch (err) {
      return { 
        ok: false, 
        message: err.response?.data?.message || err.message || "Error sending reset email" 
      };
    }
  };

  return (
    <>
      <Header
        cartCount={cart.reduce((s, it) => s + (it.qty || 1), 0)}
        user={user}
        onLogout={handleLogout}
        openAuth={(mode) => { 
          setAuthMode(mode); 
          setShowForgot(false); 
          setShowAuthModal(true); 
        }}
      />

      <div style={{ minHeight: "70vh" }}>
        <Routes>
          <Route path="/" element={
            <>
              <Hero onShopNow={() => navigate("/products")} />
              <ProductList 
                addToCart={addToCart} 
                wishlist={wishlist} 
                toggleWishlist={toggleWishlist} 
              />
              <About />
              <Contact />
              <Newsletter />
            </>
          } />
          <Route path="/products" element={
            <ProductList 
              addToCart={addToCart} 
              wishlist={wishlist} 
              toggleWishlist={toggleWishlist} 
            />
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={
            <CartPage 
              cartItems={cart} 
              setCart={setCart} 
              updateQty={updateQtyLocal} 
              removeFromCart={removeFromCartLocal} 
              clearCart={clearCartLocal} 
            />
          } />
          <Route path="/wishlist" element={
            <WishlistPage 
              wishlist={wishlist} 
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
            />
          } />
          <Route path="/checkout" element={
            <CheckoutPage 
              cart={cart} 
              user={user} 
            />
           
          } />
           <Route path="/admin" element={<AdminPanel />} />
        </Routes>
       
      </div>

      <Footer />

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="auth-modal-left">
              <h2>{showForgot ? "Reset Password" : (authMode === "login" ? "Login" : "Create account")}</h2>

              {!showForgot ? (
                <AuthForm
                  mode={authMode}
                  onLogin={handleLogin}
                  onSignup={handleSignup}
                  switchMode={() => { 
                    setAuthMode(authMode === "login" ? "signup" : "login"); 
                    setShowForgot(false); 
                  }}
                  openForgot={() => setShowForgot(true)}
                />
              ) : (
                <ForgotForm onSend={handleForgotSend} back={() => setShowForgot(false)} />
              )}

              <button className="auth-close" onClick={() => setShowAuthModal(false)}>
                Close
              </button>
            </div>

            <div className="auth-modal-right">
              <h3>Welcome to GadgetShop</h3>
              <p>Fast checkout. Secure payments. Great deals.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// AuthForm Component
function AuthForm({ mode, onLogin, onSignup, switchMode, openForgot }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (mode === "login") {
      const res = await onLogin(email, password);
      if (!res.ok) alert(res.message || "Login failed");
    } else {
      const res = await onSignup(name, email, password);
      if (!res.ok) alert(res.message || "Signup failed");
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="auth-form">
      {mode === "signup" && (
        <input 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      )}
      <input 
        placeholder="Email" 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Please wait..." : (mode === "login" ? "Login" : "Create account")}
      </button>
      
      <p className="auth-switch">
        {mode === "login" ? (
          <>New here? <button type="button" className="link-btn" onClick={switchMode}>Create account</button></>
        ) : (
          <>Already have an account? <button type="button" className="link-btn" onClick={switchMode}>Login</button></>
        )}
      </p>
      
      {mode === "login" && (
        <p>
          <button type="button" className="link-btn" onClick={openForgot}>
            Forgot password?
          </button>
        </p>
      )}
    </form>
  );
}

// ForgotForm Component
function ForgotForm({ onSend, back }) {
  const [email, setEmail] = useState("");
  const [sentMsg, setSentMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await onSend(email);
    setLoading(false);
    
    if (res.ok) {
      setSentMsg(res.message);
    } else {
      setSentMsg(res.message || "Error sending email");
    }
  };

  return (
    <div>
      {sentMsg ? (
        <div style={{ marginBottom: 8, padding: '10px', background: '#e8f5e8', borderRadius: '4px' }}>
          <strong>{sentMsg}</strong>
        </div>
      ) : null}
      
      <form onSubmit={submit} className="auth-form">
        <input 
          placeholder="Your email" 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      
      <p style={{ marginTop: 8 }}>
        <button className="link-btn" onClick={back}>
          Back to login
        </button>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}