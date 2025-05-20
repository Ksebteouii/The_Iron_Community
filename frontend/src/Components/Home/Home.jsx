import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './Home.module.css';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  return (
    <div className={`${styles.homeContainer} ${isLoaded ? styles.loaded : ""}`}>
      <div className={styles.bgShapes}>
        <div className={styles.bgShape1}></div>
        <div className={styles.bgShape2}></div>
        <div className={styles.bgShape3}></div>
      </div>
      
      <div className={styles.particles}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}>
                <span className={styles.logoIcon}>🌿</span>
                <span className={styles.logoText}>IC</span>
              </div>
            </div>
            
            <h1 className={styles.mainTitle}>
              Welcome to <span className={styles.highlight}>Iron Community</span>
            </h1>
            <div className={styles.underline}></div>
          </div>
          
          <div className={styles.authButtons}>
            <Link to="/login" className={`${styles.authBtn} ${styles.loginBtn}`}>
              <span className={styles.btnText}>Login</span>
              <span className={styles.btnIcon}>→</span>
            </Link>
            <Link to="/signup" className={`${styles.authBtn} ${styles.signupBtn}`}>
              <span className={styles.btnText}>Sign Up</span>
              <span className={styles.btnIcon}>+</span>
            </Link>
          </div>
          
          <div className={styles.featuresContainer}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🏕️</div>
              <div className={styles.featureText}>
                <h3>Discover Trails</h3>
                <p>Explore top-rated hiking paths</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🗻</div>
              <div className={styles.featureText}>
                <h3>Find Community</h3>
                <p>Connect with fellow adventurers</p>
              </div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🧗‍♀️</div>
              <div className={styles.featureText}>
                <h3>Shop Gear</h3>
                <p>Get equipped for your journey</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className={styles.homeFooter}>
        <p>© 2025 Iron Community • Explore • Connect • Conquer</p>
      </footer>
    </div>
  );
};

export default Home;