import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import { UserContext } from './UserContext';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { cartItemCount } = useContext(CartContext);
  const { user, setUser } = useContext(UserContext);
  const isStorePage = window.location.pathname === '/store';

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };
  
  return (
    <nav className="nav-bar">
      <div className="brand-name" onClick={() => navigate('/')}>Iron Community</div>
      <ul className="nav-list">
        {!isStorePage && <li><Link to="/store">Store</Link></li>}
        <li><Link to="/contact-us">Contact Us</Link></li>
        <li><Link to="/about-us">About Us</Link></li>
        {user && <li><Link to="/profile">Profile</Link></li>}
      </ul>
      
      <div className="nav-buttons">
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
        {user && (
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;