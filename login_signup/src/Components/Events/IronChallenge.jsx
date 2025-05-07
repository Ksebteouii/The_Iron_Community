import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import styles from './Events.module.css';
import EventParticipants from './EventParticipants';

const IronChallenge = () => {
  const { user, updateUserActivity } = useContext(UserContext);
  const [isSignedUp, setIsSignedUp] = useState(user?.activity === 'challenge');
  const [showParticipants, setShowParticipants] = useState(false);

  const handleSignUp = async () => {
    try {
      // Here you would typically make an API call to register the user for the event
      // For now, we'll just simulate the signup
      setIsSignedUp(true);
      updateUserActivity('challenge');
      // You would also want to update the user's profile with their chosen activity
    } catch (error) {
      console.error('Error signing up for event:', error);
    }
  };

  if (showParticipants) {
    return <EventParticipants eventType="challenge" />;
  }

  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContent}>
        <h1>Iron Community Challenge</h1>
        <div className={styles.eventDetails}>
          <div className={styles.eventImage}>
            <img src="/iron-challenge.jpg" alt="Iron Community Challenge" />
          </div>
          <div className={styles.eventInfo}>
            <h2>Push Your Limits</h2>
            <p>Join our fitness challenge community and transform yourself. Set goals, track progress, and achieve new heights with the support of fellow challengers.</p>
            
            <div className={styles.eventFeatures}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>💪</span>
                <h3>Fitness Goals</h3>
                <p>Set and achieve personal milestones</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📊</span>
                <h3>Progress Tracking</h3>
                <p>Monitor your achievements</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🏆</span>
                <h3>Community Support</h3>
                <p>Get motivated by fellow challengers</p>
              </div>
            </div>

            {!isSignedUp ? (
              <button className={styles.signUpButton} onClick={handleSignUp}>
                Join Iron Challenge
              </button>
            ) : (
              <div className={styles.signedUpMessage}>
                <p>You're signed up for the Iron Challenge!</p>
                <button className={styles.viewGroupButton} onClick={() => setShowParticipants(true)}>
                  View Challenge Group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IronChallenge; 