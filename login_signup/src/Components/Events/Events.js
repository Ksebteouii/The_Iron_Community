import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './Events.module.css';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantsError, setParticipantsError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      console.log('Events from backend:', response.data.events);
      setEvents(response.data.events.map(event => ({
        ...event,
        image: getEventImage(event.title),
        icon: getEventIcon(event.title),
        features: getEventFeatures(event.title)
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const getEventImage = (title) => {
    const images = {
      'Hiking Expedition': 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3',
      'Iron Community Challenge': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3',
      'Camping Adventure': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3'
    };
    return images[title] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3';
  };

  const getEventIcon = (title) => {
    const icons = {
      'Hiking Expedition': '🏔️',
      'Iron Community Challenge': '🏖️',
      'Camping Adventure': '🌲'
    };
    return icons[title] || '🎯';
  };

  const getEventFeatures = (title) => {
    const features = {
      'Hiking Expedition': ['Scenic Trails', 'Nature Exploration', 'Physical Challenge'],
      'Iron Community Challenge': ['Environmental Impact', 'Community Service', 'Beach Activities'],
      'Camping Adventure': ['Ecosystem Learning', 'Conservation Skills', 'Nature Education']
    };
    return features[title] || ['Community Event', 'Outdoor Activity', 'Environmental Focus'];
  };

  const handleEventClick = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(`http://localhost:5000/events/${eventId}/signup`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh events to update participant count
      fetchEvents();
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error('Error joining event:', error);
      if (error.response?.data?.error === 'Already signed up for this event') {
        navigate(`/event/${eventId}`);
      } else {
        setError('Failed to join event. Please try again later.');
      }
    }
  };

  const handleViewParticipants = async (eventId, event) => {
    setLoadingParticipants(true);
    setParticipantsError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/events/${eventId}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setEventParticipants(response.data.event.participants);
      setSelectedEvent(event);
      setShowParticipantsModal(true);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setParticipantsError('Failed to load participants. Please try again later.');
    } finally {
      setLoadingParticipants(false);
    }
  };

  const closeParticipantsModal = () => {
    setShowParticipantsModal(false);
    setSelectedEvent(null);
    setEventParticipants([]);
    setParticipantsError(null);
  };

  if (loading) {
    return (
      <div className={styles.eventPage}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.eventPage}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContent}>
        <h1>Upcoming Events</h1>
        <div className={styles.eventGrid}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventImage}>
                <img src={event.image} alt={event.title} />
                <div className={styles.eventIcon}>{event.icon}</div>
              </div>
              <div className={styles.eventInfo}>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <div className={styles.eventFeatures}>
                  {event.features.map((feature, index) => (
                    <span key={index} className={styles.featureTag}>{feature}</span>
                  ))}
                </div>
                <div className={styles.eventActions}>
                  <button 
                    onClick={() => handleViewParticipants(event.id, event)}
                    className={styles.viewButton}
                  >
                    View Participants
                  </button>
                  <button 
                    onClick={() => handleEventClick(event.id)}
                    className={styles.joinButton}
                  >
                    Join Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Participants for {selectedEvent?.title}</h2>
              <button onClick={closeParticipantsModal} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalContent}>
              {loadingParticipants ? (
                <div className={styles.loadingSpinner}><div className={styles.spinner}></div></div>
              ) : participantsError ? (
                <p className={styles.errorMessage}>{participantsError}</p>
              ) : eventParticipants.length === 0 ? (
                <p className={styles.noParticipants}>No participants yet</p>
              ) : (
                <div className={styles.participantsList}>
                  {eventParticipants.map((participant) => (
                    <div key={participant.id} className={styles.participantCard}>
                      <img
                        src={participant.profile_picture || 'https://via.placeholder.com/50'}
                        alt={participant.name}
                        className={styles.participantAvatar}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50';
                        }}
                      />
                      <div className={styles.participantInfo}>
                        <h3>{participant.name}</h3>
                        <p>{participant.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events; 