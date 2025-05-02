import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { cartItemCount } = useContext(CartContext);
  const isStorePage = window.location.pathname === '/store';
  
  return (
    <nav className="nav-bar">
      <div className="brand-name">Iron Community</div>
      <ul className="nav-list">
        {!isStorePage && <li><Link to="/store">Store</Link></li>}
        <li><Link to="/contact-us">Contact Us</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
      </ul>
      
      {isStorePage && (
        <button
          className="cart-button"
          onClick={() => navigate('/cart')}
        >
          Cart
          {cartItemCount > 0 && (
            <span className="cart-count">
              {cartItemCount}
            </span>
          )}
        </button>
      )}
    </nav>
  );
};

export default NavBar;