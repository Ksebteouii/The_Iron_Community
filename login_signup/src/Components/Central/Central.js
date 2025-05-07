import React from 'react';
import styles from './Central.module.css';
import Events from '../Events/Events';

const Central = () => {
  return (
    <div className={styles.centralPage}>
      <div className={styles.heroSection}>
        <h1>Welcome to Iron Community</h1>
        <p>Join our community and discover amazing events</p>
      </div>
      
      <div className={styles.eventsSection}>
        <Events />
      </div>
    </div>
  );
};

export default Central; 