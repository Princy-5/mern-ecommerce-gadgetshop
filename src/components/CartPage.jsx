import React from 'react';
import './CartPage.css';
function CartPage({ cart, setCart }) {
  // Calculate total price considering quantity
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const increaseQuantity = (id) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (id) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    ));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Price: ₹{item.price}</p>
               <div className="quantity-controls">
  <button onClick={() => decreaseQuantity(item.id)}>-</button>
  <span>{item.quantity}</span>
  <button onClick={() => increaseQuantity(item.id)}>+</button>
</div>
<button className="remove-button" onClick={() => removeItem(item.id)}>Remove</button>

              </div>
            </div>
          ))}
          <hr />
          <h3 className="total">Total: ₹{total}</h3>
          <button className="checkout-button">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;

