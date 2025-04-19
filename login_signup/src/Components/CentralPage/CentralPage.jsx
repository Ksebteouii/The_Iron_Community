import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CentralPage.css';
import mountains from '../Assets/mountains.jpg';

const CentralPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const handleSearch = () => {
    console.log("Searching for:", searchValue);
    // Add search functionality here
  };

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
          
          <div className="search-container">
            <input
              type="text"
              placeholder="What adventure calls you?"
              className="central-search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              Explore
            </button>
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