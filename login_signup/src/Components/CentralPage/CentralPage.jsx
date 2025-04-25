import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CentralPage.css';
import mountains from '../Assets/mountains.jpg';

const CentralPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  return (
    <div 
      className={`central-container ${isLoaded ? 'loaded' : ''}`}
      style={{ backgroundImage: `url(${mountains})` }}
    >
      {/* Top Navigation Bar */}
      <div className="top-bar">
        <div className="top-left">
          <div className="logo-icon">IC</div>
          <h2 className="site-title">Iron Community</h2>
        </div>
        <div className="top-right">
          <button
            className="nav-button"
            onClick={() => navigate('/store')}
          >
            <span className="button-text">Visit Store</span>
            <span className="button-icon">→</span>
          </button>
        </div>
      </div>

      {/* Centered Content */}
      <div className="content-wrapper">
        <div className="central-content">
          <h1 className="main-title">Embrace The Wild</h1>
          <p className="subtitle">Conquer Nature with the Right Gear</p>
          
          <div className="adventure-categories">
            <div className="adventure-category">
              <h3 className="category-title">Hiking</h3>
              <p className="category-description">
                Step into the wilderness and discover scenic trails that wind through forests, mountains, and valleys. 
                Our community provides expert tips on hiking gear, trail information, and safety guidelines to make your 
                journey memorable and enjoyable.
              </p>
            </div>
            
            <div className="adventure-category">
              <h3 className="category-title">Camping</h3>
              <p className="category-description">
                Experience the freedom of the outdoors with our camping resources. From weekend getaways to extended backpacking trips, 
                learn about essential equipment, camp setup techniques, and how to leave no trace while enjoying nature's beauty.
              </p>
            </div>
            
            <div className="adventure-category">
              <h3 className="category-title">Climbing</h3>
              <p className="category-description">
                Challenge yourself with rock climbing adventures tailored for all skill levels. Our climbing guides cover equipment selection, 
                technique improvement, safety protocols, and the best climbing destinations around the world to help you reach new heights.
              </p>
            </div>
            
            <div className="adventure-category">
              <h3 className="category-title">Trails</h3>
              <p className="category-description">
                Explore our curated collection of trails ranging from easy walks to challenging multi-day hikes. We provide detailed maps, 
                difficulty ratings, seasonal recommendations, and insider tips to help you plan your perfect outdoor adventure.
              </p>
            </div>
          </div>
          
          <div className="feature-tags">
            <span className="tag">Hiking</span>
            <span className="tag">Camping</span>
            <span className="tag">Climbing</span>
            <span className="tag">Trails</span>
          </div>
        </div>
      </div>
      
      <div className="bottom-bar">
        <p className="tagline">Discover • Explore • Conquer</p>
      </div>
    </div>
  );
};

export default CentralPage;