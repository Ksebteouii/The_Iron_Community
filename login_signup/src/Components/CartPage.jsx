import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    // Simulate loading and trigger animations
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 200 ? 0 : 15.99;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };
  
  const handleCheckout = () => {
    alert('Checkout functionality will be implemented here.');
    // Here you would normally proceed to a checkout page or process
  };

  return (
    <div className={`cart-page-container ${isLoaded ? 'loaded' : ''}`}>
      <div className="cart-header">
        <div className="logo-container" onClick={() => navigate('/store')}>
          <div className="logo">WO</div>
        </div>
        <h1 className="cart-title">YOUR CART</h1>
        <button className="back-button" onClick={() => navigate('/store')}>
          &larr; BACK TO STORE
        </button>
      </div>
      
      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <button 
              className="continue-shopping"
              onClick={() => navigate('/store')}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              <div className="cart-items-header">
                <span className="item-header">Product</span>
                <span className="quantity-header">Quantity</span>
                <span className="price-header">Price</span>
                <span className="total-header">Total</span>
                <span className="remove-header"></span>
              </div>
              
              {cart.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="item-details">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <span className="item-name">{item.name}</span>
                  </div>
                  
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <span className="item-price">${item.price.toFixed(2)}</span>
                  <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h3 className="summary-title">ORDER SUMMARY</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {calculateShipping() === 0 
                    ? 'FREE' 
                    : `$${calculateShipping().toFixed(2)}`
                  }
                </span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              
              <button 
                className="checkout-button"
                onClick={handleCheckout}
              >
                PROCEED TO CHECKOUT
              </button>
              
              <p className="shipping-note">
                Free shipping on orders over $200
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="cart-footer">
        <p className="copyright">© 2025 WILD OUTDOORS • ALL RIGHTS RESERVED</p>
      </div>
    </div>
  );
};

export default CartPage;