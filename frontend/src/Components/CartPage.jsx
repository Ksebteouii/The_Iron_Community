import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
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
  
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsCheckingOut(true);
    try {
      

     
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      

      cart.forEach(item => removeFromCart(item.id));
      
      
      alert('Order placed successfully! Thank you for your purchase.');
      
      // Redirect to store page
      navigate('/store');
    } catch (error) {
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className={`cart-page-container${cart.length === 0 ? ' empty-cart-bg' : ''} ${isLoaded ? 'loaded' : ''}`}>
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
            <div className="empty-cart-icon" role="img" aria-label="Empty Cart">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="32" cy="56" rx="18" ry="4" fill="#2EA83522"/>
                <path d="M16 20h32l-4 24H20L16 20z" fill="#2EA835" stroke="#1F7529" strokeWidth="2"/>
                <circle cx="24" cy="48" r="3" fill="#fff" stroke="#1F7529" strokeWidth="2"/>
                <circle cx="40" cy="48" r="3" fill="#fff" stroke="#1F7529" strokeWidth="2"/>
                <path d="M20 28h24" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
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
                      disabled={isCheckingOut}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isCheckingOut}
                    >
                      +
                    </button>
                  </div>
                  
                  <span className="item-price">${item.price.toFixed(2)}</span>
                  <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    disabled={isCheckingOut}
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
                className={`checkout-button ${isCheckingOut ? 'checking-out' : ''}`}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  'PROCEED TO CHECKOUT'
                )}
              </button>
              
              <p className="shipping-note">
                
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