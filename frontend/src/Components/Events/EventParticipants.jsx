import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './Events.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';

const EventParticipants = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user, loading: userLoading } = useContext(UserContext);

  useEffect(() => {
    if (userLoading) return; // Wait for user context to finish loading
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          `http://localhost:5000/events/${eventId}/participants`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setParticipants(response.data.participants || response.data.event?.participants || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching participants:', error);
        setError('Failed to load participants. Please try again later.');
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId, user, userLoading, navigate]);

  if (userLoading || loading) {
    return <div className={styles.loadingSpinner}>Loading participants...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContent}>
        <h1>Event Participants</h1>
        <div className={styles.participantsList}>
          {participants.length === 0 ? (
            <p className={styles.noParticipants}>No participants yet</p>
          ) : (
            participants.map((participant) => (
              <div key={participant.id} className={styles.participantCard}>
                <img
                  src={participant.profile?.profile_picture ? participant.profile.profile_picture : '/images/default-avatar.png'}
                  alt={participant.profile?.name || participant.name}
                  className={styles.participantAvatar}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/images/default-avatar.png';
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