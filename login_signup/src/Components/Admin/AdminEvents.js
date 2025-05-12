import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminEvents.module.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    max_participants: '',
    status: 'active'
  });
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantsError, setParticipantsError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEvents(response.data.events);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      max_participants: event.max_participants,
      status: event.status
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/admin/events/${editingEvent.id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Refresh events list
      fetchEvents();
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        max_participants: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event');
    }
  };

  const getEventImage = (title) => {
    const images = {
      'Hiking Expedition': 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3',
      'Iron Community Challenge': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3',
      'Camping Adventure': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3'
    };
    return images[title] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3';
  };

  const handleViewParticipants = async (event) => {
    setSelectedEvent(event);
    setShowParticipantsModal(true);
    setLoadingParticipants(true);
    setParticipantsError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/events/${event.id}/participants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setParticipants(response.data.event.participants);
    } catch (error) {
      setParticipantsError('Failed to load participants.');
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleRemoveParticipant = async (eventId, userId) => {
    if (!window.confirm('Are you sure you want to remove this participant?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/admin/events/${eventId}/participants/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Refresh participants list
      handleViewParticipants(selectedEvent);
    } catch (error) {
      alert('Failed to remove participant.');
    }
  };

  const closeParticipantsModal = () => {
    setShowParticipantsModal(false);
    setSelectedEvent(null);
    setParticipants([]);
    setParticipantsError(null);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.adminEvents}>
      <h2>Manage Events</h2>
      
      {editingEvent && (
        <div className={styles.editForm}>
          <h3>Edit Event</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Time:</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Max Participants:</label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton}>Save Changes</button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setEditingEvent(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.eventsList}>
        {events.map(event => (
          <div key={event.id} className={styles.eventCard}>
            <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderRadius: '8px 8px 0 0', marginBottom: '10px' }}>
              <img
                src={getEventImage(event.title)}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div className={styles.eventDetails}>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Max Participants:</strong> {event.max_participants}</p>
              <p><strong>Status:</strong> {event.status}</p>
            </div>
            <button 
              className={styles.editButton}
              onClick={() => handleEdit(event)}
            >
              Edit Event
            </button>
            <button
              className={styles.viewButton}
              onClick={() => handleViewParticipants(event)}
            >
              View Participants
            </button>
          </div>
        ))}
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
                <p className={styles.error}>{participantsError}</p>
              ) : participants.length === 0 ? (
                <p className={styles.noParticipants}>No participants yet</p>
              ) : (
                <div className={styles.participantsList}>
                  {participants.map((participant) => (
                    <div key={participant.id} className={styles.participantCard}>
                      <img
                        src={participant.profile_picture || '/images/default-avatar.png'}
                        alt={participant.name}
                        className={styles.participantAvatar}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = '/images/default-avatar.png';
                        }}
                      />
                      <span className={styles.participantName}>{participant.name}</span>
                      <div className={styles.participantInfo}>
                        <p>{participant.email}</p>
                      </div>
                      <button
                        className={styles.removeButton}
                        onClick={() => handleRemoveParticipant(selectedEvent.id, participant.id)}
                      >
                        Remove
                      </button>
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

export default AdminEvents; 