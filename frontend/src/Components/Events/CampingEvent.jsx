import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import styles from './Events.module.css';
import EventParticipants from './EventParticipants';

const CampingEvent = () => {
  const navigate = useNavigate();
  const { user, updateUserActivity } = useContext(UserContext);
  const [isSignedUp, setIsSignedUp] = useState(user?.activity === 'camping');
  const [showParticipants, setShowParticipants] = useState(false);

  const handleSignUp = async () => {
    try {
      // Here you would typically make an API call to register the user for the event
      // For now, we'll just simulate the signup
      setIsSignedUp(true);
      updateUserActivity('camping');
      // You would also want to update the user's profile with their chosen activity
    } catch (error) {
      console.error('Error signing up for event:', error);
    }
  };

  if (showParticipants) {
    return <EventParticipants eventType="camping" />;
  }

  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContent}>
        <h1>Camping Event</h1>
        <div className={styles.eventDetails}>
          <div className={styles.eventImage}>
            <img src="/camping-event.jpg" alt="Camping Event" />
          </div>
          <div className={styles.eventInfo}>
            <h2>Experience the Great Outdoors</h2>
            <p>Join our camping community for unforgettable outdoor adventures. Learn essential camping skills, connect with nature, and create lasting memories with fellow campers.</p>
            
            <div className={styles.eventFeatures}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>⛺</span>
                <h3>Camping Skills</h3>
                <p>Learn essential camping techniques</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🔥</span>
                <h3>Campfire Stories</h3>
                <p>Share experiences under the stars</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🌙</span>
                <h3>Night Activities</h3>
                <p>Stargazing and night hikes</p>
              </div>
            </div>

            {!isSignedUp ? (
              <button className={styles.signUpButton} onClick={handleSignUp}>
                Sign Up for Camping Event
              </button>
            ) : (
              <div className={styles.signedUpMessage}>
                <p>You're signed up for the Camping Event!</p>
                <button className={styles.viewGroupButton} onClick={() => setShowParticipants(true)}>
                  View Camping Group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampingEvent; 