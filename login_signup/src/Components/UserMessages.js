import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserMessages.module.css';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your messages');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/user/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  const getGravatarUrl = (email) => {
    if (!email) {
      return 'https://www.gravatar.com/avatar/default?d=identicon&s=50';
    }
    const hash = email.trim().toLowerCase();
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=50`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.messagesContainer}>
      <h2>My Messages</h2>
      {messages.length === 0 ? (
        <div className={styles.noMessages}>
          <p>You haven't sent any messages yet.</p>
        </div>
      ) : (
        <div className={styles.messagesList}>
          {messages.map(message => (
            <div key={message.id} className={styles.messageCard}>
              <div className={styles.messageHeader}>
                <div className={styles.userInfo}>
                  <img 
                    src={getGravatarUrl(message.user_email)} 
                    alt="Profile" 
                    className={styles.profilePicture}
                  />
                  <span className={styles.userName}>
                    {message.user_name || 'User'}
                  </span>
                </div>
                <span className={styles.messageDate}>
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
                <span className={`${styles.messageStatus} ${message.admin_reply ? styles.replied : styles.pending}`}>
                  {message.admin_reply ? 'Replied' : 'Pending'}
                </span>
              </div>
              <div className={styles.messageContent}>
                <h3>Your Message:</h3>
                <p>{message.message}</p>
              </div>
              {message.admin_reply && (
                <div className={styles.replyContent}>
                  <h3>Admin's Reply:</h3>
                  <p>{message.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMessages; 