import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Events.module.css';

const EventParticipants = ({ eventType }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          `http://localhost:5000/events/${eventType}/participants`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setParticipants(response.data.participants);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching participants:', error);
        setError('Failed to load participants. Please try again later.');
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventType]);

  if (loading) {
    return <div className={styles.loadingSpinner}>Loading participants...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContent}>
        <h1>{eventType.charAt(0).toUpperCase() + eventType.slice(1)} Event Participants</h1>
        <div className={styles.participantsList}>
          {participants.length === 0 ? (
            <p className={styles.noParticipants}>No participants yet</p>
          ) : (
            participants.map((participant) => (
              <div key={participant.id} className={styles.participantCard}>
                <img
                  src={participant.profile?.profile_picture || 'https://via.placeholder.com/50'}
                  alt={participant.name}
                  className={styles.participantAvatar}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/50';
                  }}
                />
                <div className={styles.participantInfo}>
                  <h3>{participant.profile?.name || participant.name}</h3>
                  <p>{participant.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventParticipants; 