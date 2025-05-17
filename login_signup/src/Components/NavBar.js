import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import styles from './NavBar.module.css';

const NavBar = () => {
  const { user, logout } = useUser(); // Get the user and logout function from the context 
  const navigate = useNavigate(); 
  const isStorePage = location.pathname === '/store'; // Check if the current path is the store page 

  const handleLogout = () => { 
    logout();
    navigate('/login'); 
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link to="/events" className={styles.navLink}>Events</Link>
        <Link to="/store" className={styles.navLink}>Store</Link>
        {isStorePage && (
          <Link to="/cart" className={styles.navLink}>Cart</Link>
        )}
        <Link to="/messages" className={styles.navLink}>Messages</Link>
        <Link to="/about-us" className={styles.navLink}>About Us</Link>
        <Link to="/contact-us" className={styles.navLink}>Contact Us</Link>
        {user && (
          <Link to="/profile" className={styles.navLink}>Profile</Link>
        )}
        {user?.isAdmin && (
          <Link to="/admin" className={styles.navLink}>Admin</Link>
        )}
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar; 