import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={styles.layout}>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
            <span className={styles.logoIcon}>🌿</span>
            <span>Iron Community</span>
          </Link>

          <div className={styles.navLinks}>
            <Link
              to="/"
              className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
            >
              About
            </Link>
            <Link
              to="/login"
              className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`${styles.navLink} ${isActive('/signup') ? styles.active : ''}`}
            >
              Sign Up
            </Link>
          </div>

          <button 
            className={styles.mobileMenuBtn}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
          <div className={styles.mobileMenuHeader}>
            <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
              <span className={styles.logoIcon}>🌿</span>
              <span>Iron Community</span>
            </Link>
            <button 
              className={styles.mobileMenuBtn}
              onClick={closeMobileMenu}
              aria-label="Close mobile menu"
            >
              ✕
            </button>
          </div>
          <div className={styles.mobileMenuLinks}>
            <Link
              to="/"
              className={`${styles.mobileMenuLink} ${isActive('/') ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${styles.mobileMenuLink} ${isActive('/about') ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              to="/login"
              className={`${styles.mobileMenuLink} ${isActive('/login') ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`${styles.mobileMenuLink} ${isActive('/signup') ? styles.active : ''}`}
              onClick={closeMobileMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>About Us</h3>
            <Link to="/about" className={styles.footerLink}>
              Our Story
            </Link>
            <Link to="/about" className={styles.footerLink}>
              Mission & Vision
            </Link>
            <Link to="/about" className={styles.footerLink}>
              Team
            </Link>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Resources</h3>
            <Link to="/blog" className={styles.footerLink}>
              Blog
            </Link>
            <Link to="/faq" className={styles.footerLink}>
              FAQ
            </Link>
            <Link to="/contact" className={styles.footerLink}>
              Contact
            </Link>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Connect</h3>
            <div className={styles.socialLinks}>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                🐦
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                📸
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                💼
              </a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          © {new Date().getFullYear()} The Iron Community. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout; 