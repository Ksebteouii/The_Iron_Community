import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserMessages.module.css';
import { useUser } from '../Components/UserContext';

const UserMessages = () => {
  const { user } = useUser();
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
      <h2 className={styles.title}>My Messages</h2>
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : messages.length === 0 ? (
        <div className={styles.noMessages}>No messages found.</div>
      ) : (
        <div className={styles.messagesList}>
          {messages.map(message => (
            <div key={message.id} className={styles.messageCard}>
              <div className={styles.messageHeader}>
                <img
                  src={user?.profile_picture || 'https://via.placeholder.com/64'}
                  alt={user?.name || 'User'}
                  className={styles.profileAvatar}
                />
                <span className={styles.userName}>{message.user_name || user?.name || 'User'}</span>
                <span className={styles.messageDate}>{new Date(message.created_at).toLocaleDateString()}</span>
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