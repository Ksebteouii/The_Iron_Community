import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Events.module.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from your backend
    const events = [
      {
        id: 1,
        title: "Camping Adventure",
        description: "Join us for an unforgettable camping experience in the wilderness. Learn survival skills, enjoy nature, and make new friends.",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3",
        features: ["Tent Setup", "Campfire Cooking", "Nature Walks"],
        icon: "🏕️",
        date: "June 15-17, 2024",
        location: "Mountain View Campground",
        maxParticipants: 20,
        currentParticipants: 12
      },
      {
        id: 2,
        title: "Hiking Expedition",
        description: "Challenge yourself with our guided hiking expedition. Perfect for both beginners and experienced hikers.",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3",
        features: ["Scenic Trails", "Fitness Training", "Photography"],
        icon: "🏃",
        date: "July 1-3, 2024",
        location: "Eagle Peak Trail",
        maxParticipants: 15,
        currentParticipants: 8
      },
      {
        id: 3,
        title: "Iron Community Challenge",
        description: "Test your limits in our community fitness challenge. A perfect blend of strength, endurance, and teamwork.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3",
        features: ["Team Building", "Fitness Goals", "Community Spirit"],
        icon: "💪",
        date: "August 5-7, 2024",
        location: "Community Center",
        maxParticipants: 30,
        currentParticipants: 18
      }
    ];

    const foundEvent = events.find(e => e.id === parseInt(id));
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      navigate('/events');
    }
  }, [id, navigate]);

  const handleSignUp = async () => {
    try {
      // In a real app, this would make an API call to your backend
      setIsSignedUp(true);
    } catch (error) {
      console.error('Error signing up for event:', error);
    }
  };

  if (!event) return null;

  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContent}>
        <button className={styles.backButton} onClick={() => navigate('/events')}>
          ← Back to Events
        </button>
        
        <div className={styles.eventDetail}>
          <div className={styles.eventImage}>
            <img src={event.image} alt={event.title} />
            <div className={styles.eventIcon}>{event.icon}</div>
          </div>
          
          <div className={styles.eventInfo}>
            <h1>{event.title}</h1>
            <div className={styles.eventMeta}>
              <span>📅 {event.date}</span>
              <span>📍 {event.location}</span>
              <span>👥 {event.currentParticipants}/{event.maxParticipants} participants</span>
            </div>
            
            <p>{event.description}</p>
            
            <div className={styles.eventFeatures}>
              {event.features.map((feature, index) => (
                <span key={index} className={styles.featureTag}>{feature}</span>
              ))}
            </div>
            
            {!isSignedUp ? (
              <button 
                className={styles.joinButton}
                onClick={handleSignUp}
                disabled={event.currentParticipants >= event.maxParticipants}
              >
                {event.currentParticipants >= event.maxParticipants 
                  ? 'Event Full' 
                  : 'Join Event'}
              </button>
            ) : (
              <div className={styles.signedUpMessage}>
                <p>You're signed up for this event! 🎉</p>
                <button 
                  className={styles.viewGroupButton}
                  onClick={() => navigate(`/events/${id}/group`)}
                >
                  View Event Group
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 