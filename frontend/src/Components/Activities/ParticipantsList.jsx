import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ParticipantsList.css';

const ParticipantsList = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/activities/${activityId}/participants`);
        setParticipants(response.data.participants);
      } catch (err) {
        console.error('Error fetching participants:', err);
        setError('Failed to load participants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [activityId]);

  const getActivityTitle = (id) => {
    const titles = {
      'hiking': 'Hiking',
      'camping': 'Camping',
      'iron-community': 'Iron Community'
    };
    return titles[id] || id;
  };

  if (loading) {
    return (
      <div className="participants-container">
        <div className="participants-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading participants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="participants-container">
        <div className="participants-content">
          <div className="error-message">
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="participants-container">
      <div className="participants-content">
        <h1 className="participants-title">
          {getActivityTitle(activityId)} Participants
        </h1>
        
        <div className="participants-grid">
          {participants.length > 0 ? (
            participants.map((participant) => (
              <div key={participant.id} className="participant-card">
                <div className="participant-avatar">
                  <div className="avatar-placeholder">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="participant-info">
                  <h3>{participant.name}</h3>
                  <p>{participant.email}</p>
                  <p className="join-date">Joined: {new Date(participant.joined_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-participants">
              <p>No participants yet. Be the first to join!</p>
            </div>
          )}
        </div>

        <button 
          className="back-button"
          onClick={() => navigate('/central')}
        >
          Back to Activities
        </button>
      </div>
    </div>
  );
};

export default ParticipantsList; 