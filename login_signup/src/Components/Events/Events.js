import React from 'react';
import styles from './Events.module.css';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const events = [
    {
      id: 1,
      title: "Camping Adventure",
      description: "Join us for an unforgettable camping experience in the wilderness. Learn survival skills, enjoy nature, and make new friends.",
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3",
      features: ["Tent Setup", "Campfire Cooking", "Nature Walks"],
      icon: "🏕️"
    },
    {
      id: 2,
      title: "Hiking Expedition",
      description: "Challenge yourself with our guided hiking expedition. Perfect for both beginners and experienced hikers.",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3",
      features: ["Scenic Trails", "Fitness Training", "Photography"],
      icon: "🏃"
    },
    {
      id: 3,
      title: "Iron Community Challenge",
      description: "Test your limits in our community fitness challenge. A perfect blend of strength, endurance, and teamwork.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3",
      features: ["Team Building", "Fitness Goals", "Community Spirit"],
      icon: "💪"
    }
  ];

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className={styles.eventPage}>
      <div className={styles.eventContent}>
        <h1>Upcoming Events</h1>
        <div className={styles.eventGrid}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard} onClick={() => handleEventClick(event.id)}>
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
                <button className={styles.joinButton}>Join Event</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events; 