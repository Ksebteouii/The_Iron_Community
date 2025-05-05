import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from './CartContext';
import './StorePage.css';

const StorePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [productHover, setProductHover] = useState(null);
  const { addToCart } = useContext(CartContext);
  
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
      <div className="store-content">
        <div className="hero-section">
          <div className="hero-text">
            <h2>PREMIUM <span className="highlight">OUTDOOR GEAR</span></h2>
            <p className="store-description">
              We're crafting the ultimate collection for nature enthusiasts who demand 
              quality and performance. Our gear is designed for those who seek adventure in the wild.
            </p>
          </div>
          <div className="hero-image">
            <img src="/images/hero-gear.png" alt="Premium Outdoor Gear" className="floating-image pulse-glow" />
          </div>
        </div>

        <div className="adventure-section">
          <div className="adventure-content">
            <div className="adventure-text">
              <h3 className="adventure-title">Hiking Adventures</h3>
              <p className="adventure-description">
                Embark on unforgettable journeys through nature's most breathtaking landscapes. 
                Our premium hiking gear ensures comfort, safety, and performance on every trail. 
                From lightweight backpacks to durable footwear, we've got everything you need 
                to conquer any mountain.
              </p>
            </div>
            <div className="adventure-image">
              <img src="/images/hero-gear.png" alt="Hiking Gear" className="floating-image" />
            </div>
          </div>

          <div className="adventure-content reverse">
            <div className="adventure-text">
              <h3 className="adventure-title">Camping Experience</h3>
              <p className="adventure-description">
                Create lasting memories under the stars with our top-tier camping equipment. 
                Whether you're a weekend warrior or a seasoned outdoor enthusiast, our gear 
                transforms any campsite into a comfortable home away from home. Experience 
                the perfect blend of durability and comfort in the wilderness.
              </p>
            </div>
            <div className="adventure-image">
              <img src="/images/hero-gear.png" alt="Camping Gear" className="floating-image" />
            </div>
          </div>
        </div>
        
        <div className="featured-section">
          <h3 className="section-title">FEATURED PRODUCTS</h3>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onMouseEnter={() => setProductHover(product.id)}
                onMouseLeave={() => setProductHover(null)}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {productHover === product.id && (
                    <div className="product-overlay">
                      <button
                        className="notify-button"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-price">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;