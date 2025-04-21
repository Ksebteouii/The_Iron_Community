import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  return (
    <div className={`home-container ${isLoaded ? "loaded" : ""}`}>
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      <main className="main-content">
        <div className="content-container">
          <div className="logo-container">
            <div className="logo">IC</div>
          </div>
          
          <h1 className="main-title">Welcome to <span className="highlight">Iron Community</span></h1>
          <p className="subtitle">Join fellow outdoor enthusiasts and discover the best nature has to offer</p>
          
          <div className="auth-buttons">
            <Link to="/login" className="auth-btn login-btn">
              <span className="btn-text">Login</span>
              <span className="btn-icon">→</span>
            </Link>
            <Link to="/signup" className="auth-btn signup-btn">
              <span className="btn-text">Sign Up</span>
              <span className="btn-icon">+</span>
            </Link>
          </div>
          
          <div className="features-container">
            <div className="feature">
              <div className="feature-icon">🏕️</div>
              <div className="feature-text">
                <h3>Discover Trails</h3>
                <p>Explore top-rated hiking paths</p>
              </div>
            </div>
            
            <div className="feature">
              <div className="feature-icon">🗻</div>
              <div className="feature-text">
                <h3>Find Community</h3>
                <p>Connect with fellow adventurers</p>
              </div>
            </div>
            
            <div className="feature">
              <div className="feature-icon">🧗‍♀️</div>
              <div className="feature-text">
                <h3>Shop Gear</h3>
                <p>Get equipped for your journey</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="home-footer">
        <p>© 2025 Iron Community • Explore • Connect • Conquer</p>
      </footer>
    </div>
  );
};

export default Home;