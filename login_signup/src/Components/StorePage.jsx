import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import './StorePage.css';

const StorePage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [productHover, setProductHover] = useState(null);
  const { addToCart, cartItemCount } = useContext(CartContext);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const featuredProducts = [
    { id: 1, name: 'Alpine Explorer Backpack', price: 149.99, image: '/images/backpack.jpg' },
    { id: 2, name: 'Wilderness Trail Jacket', price: 219.99, image: '/images/jacket.jpg' },
    { id: 3, name: 'Summit Hiking Boots', price: 179.99, image: '/images/boots.jpg' },
    { id: 4, name: 'Survival Knife', price: 49.99, image: '/images/knife.png' },
    { id: 5, name: 'Camping Tent', price: 129.99, image: '/images/tente.png' },
    { id: 6, name: 'Outdoor Sleeping Bed', price: 89.99, image: '/images/bed.png' },
  ];

  return (
    <div className={`store-container ${isLoaded ? 'loaded' : ''}`}>
      <div className="store-header">
        <div className="logo-container">
          <div className="logo">WO</div>
        </div>
        <h1 className="store-title">WILD OUTDOORS</h1>
        <p className="store-tagline">EXPLORE THE WILDERNESS • CONQUER THE PEAKS</p>

        <div className="cart-container">
          <button className="cart-button" onClick={() => navigate('/cart')}>
            <span className="cart-icon">🛒</span>
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="store-content">
        <div className="hero-section">
          <div className="hero-text">
            <h2>PREMIUM <span className="highlight">OUTDOOR GEAR</span></h2>
            <p className="store-description">
              We're crafting the ultimate collection for nature enthusiasts who demand 
              quality and performance. Our gear is designed for those who seek adventure in the wild.
            </p>
            <button className="cta-button">EXPLORE COLLECTION</button>
          </div>
          <div className="hero-image">
            <img src="/images/hero-gear.png" alt="Hero Gear" />
          </div>
        </div>

        <div className="featured-section">
          <h3 className="section-title">FEATURED PRODUCTS</h3>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div 
                className="product-card" 
                key={product.id}
                onMouseEnter={() => setProductHover(product.id)}
                onMouseLeave={() => setProductHover(null)}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {productHover === product.id && (
                    <div className="product-overlay">
                      <button 
                        className="add-to-cart-button"
                        onClick={() => {
                          addToCart(product);
                          setProductHover(null);
                        }}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <span className="product-price">${product.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="store-footer">
        <div className="footer-content">
          <div className="social-icons">
            <span className="icon">IG</span>
            <span className="icon">TW</span>
            <span className="icon">YT</span>
          </div>
          <p className="copyright">© 2025 WILD OUTDOORS • ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
