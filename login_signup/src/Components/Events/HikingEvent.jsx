import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';
import styles from './Events.module.css';
import EventParticipants from './EventParticipants';

const HikingEvent = () => {
  const navigate = useNavigate();
  const { user, setUser, updateUserActivity } = useContext(UserContext);
  const [isSignedUp, setIsSignedUp] = useState(user?.activity === 'hiking');
  const [error, setError] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);

  const handleSignUp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Update the user's activity in the database
      const response = await axios.put(
        `http://localhost:5000/users/${user.id}/activity`,
        { activity: 'hiking' },
        config
      );

      if (response.data.success) {
        // Update local state
        setIsSignedUp(true);
        updateUserActivity('hiking');
        // Update the user object in context
        setUser(prevUser => ({
          ...prevUser,
          activity: 'hiking'
        }));
      }
    } catch (error) {
      console.error('Error signing up for event:', error);
      if (error.response) {
        setError(`Server error: ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(error.message || 'Failed to sign up for the event. Please try again.');
      }
    }
  };

  if (showParticipants) {
    return <EventParticipants eventType="hiking" />;
  }

  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContent}>
        <h1>Hiking Event</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.eventDetails}>
          <div className={styles.eventImage}>
            <img src="/hiking-event.jpg" alt="Hiking Event" />
          </div>
          <div className={styles.eventInfo}>
            <h2>Join Our Hiking Community</h2>
            <p>Experience the thrill of hiking with fellow enthusiasts. Our hiking events are designed for all skill levels, from beginners to experienced hikers.</p>
            
            <div className={styles.eventFeatures}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🏃</span>
                <h3>Guided Hikes</h3>
                <p>Professional guides lead our hiking groups</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🌲</span>
                <h3>Scenic Trails</h3>
                <p>Explore beautiful natural landscapes</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>👥</span>
                <h3>Community</h3>
                <p>Connect with fellow hiking enthusiasts</p>
              </div>
            </div>

            {!isSignedUp ? (
              <button className={styles.signUpButton} onClick={handleSignUp}>
                Sign Up for Hiking Event
              </button>
            ) : (
              <div className={styles.signedUpMessage}>
                <p>You're signed up for the Hiking Event!</p>
                <button className={styles.viewGroupButton} onClick={() => setShowParticipants(true)}>
                  View Hiking Group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HikingEvent; 