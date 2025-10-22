import { useNavigate } from 'react-router-dom';
import  "./Header.css";

function Header({ cart, setShowLogin, setShowSignup, showLogin, showSignup }) {
  const navigate = useNavigate();

  return (

    <header className="header">
          <h1 className="logo">
  <img src="https://img.icons8.com/ios-filled/100/4f46e5/electronics.png
" alt="GadgetShop logo" />
</h1>

      <h1><span>Gadget</span>Shop</h1>
      <nav>
        <a href="/">Home</a>
        <a href="#products">Products</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="header-right">
        <div className="cart" onClick={() => navigate('/cart')}>
          🛒 <span className="cart-badge">{cart}</span>
        </div>
        <div className="auth-buttons">
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>
      </div>
      {showLogin && ( <div className="modal"> <div className="modal-content"> <h3>Login</h3> <input type="text" placeholder="Email" /> <input type="password" placeholder="Password" /> <button>Submit</button> <button onClick={() => setShowLogin(false)}>Close</button> </div> 
      </div> 
    )} 
      {showSignup && ( <div className="modal"> <div className="modal-content"> <h3>Sign Up</h3> <input type="text" placeholder="Name" /> <input type="email" placeholder="Email" /> <input type="password" placeholder="Password" /> <button>Register</button> <button onClick={() => setShowSignup(false)}>Close</button>
      </div> 
    </div>
     )}

     
    </header>
  );
}

export default Header;
