import React from 'react';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          <span className={styles.highlight}>The Iron Community</span>
        </h1>
        <p className={styles.subtitle}>Building Tomorrow's Culture Today</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Our Vision</h2>
            <p className={styles.text}>
              We're not just creating a platform; we're crafting a movement. A new culture where
              innovation meets tradition, where technology serves humanity, and where every voice
              matters.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Coming Soon</h2>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.icon}>🚀</span>
                <h3>Brand Launch</h3>
                <p>Get ready for something revolutionary</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.icon}>💡</span>
                <h3>Innovation Hub</h3>
                <p>Where ideas transform into reality</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.icon}>🌍</span>
                <h3>Global Community</h3>
                <p>Connecting minds across borders</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Join the Movement</h2>
            <p className={styles.text}>
              We're building more than just a platform – we're creating a legacy. Stay tuned for
              our upcoming brand launch and be part of something extraordinary.
            </p>
            <div className={styles.cta}>
              <button className={styles.button}>Stay Updated</button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Our Promise</h2>
            <div className={styles.promises}>
              <div className={styles.promise}>
                <span className={styles.check}>✓</span>
                <p>Innovation at every step</p>
              </div>
              <div className={styles.promise}>
                <span className={styles.check}>✓</span>
                <p>Community-driven development</p>
              </div>
              <div className={styles.promise}>
                <span className={styles.check}>✓</span>
                <p>Transparent communication</p>
              </div>
              <div className={styles.promise}>
                <span className={styles.check}>✓</span>
                <p>Continuous improvement</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <p>© 2024 The Iron Community. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
