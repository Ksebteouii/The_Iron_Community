import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserMessages.module.css';
import { useUser } from '../Components/UserContext';

const UserMessages = () => {
  // Get current user data from context
  const { user } = useUser();
  
  // State management for messages and UI
  const [messages, setMessages] = useState([]);  // Stores user's messages
  const [loading, setLoading] = useState(true);  // Loading state for API calls
  const [error, setError] = useState(null);      // Error state for error handling

  
  useEffect(() => {
    fetchMessages();
  }, []);

  
  const fetchMessages = async () => {
    try {
      // Get authentication token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your messages');
        setLoading(false);
        return;
      }

      // Make API call to get user's messages
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

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.messagesContainer}>
      <h2 className={styles.title}>My Messages</h2>
      
      {/* Show loading state */}
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : messages.length === 0 ? (
        <div className={styles.noMessages}>No messages found.</div>
      ) : (
        <div className={styles.messagesList}>
          {/* Map through messages and display each one */}
          {messages.map(message => (
            <div key={message.id} className={styles.messageCard}>
              {/* Message header with user info and status */}
              <div className={styles.messageHeader}>
                <img
                  src={user?.profile_picture || 'https://via.placeholder.com/64'}
                  alt={user?.name || 'User'}
                  className={styles.profileAvatar}
                />
                <span className={styles.userName}>
                  {message.user_name || user?.name || 'User'}
                </span>
                <span className={styles.messageDate}>
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
                {/* Status indicator - shows if message has been replied to */}
                <span className={`${styles.messageStatus} ${message.admin_reply ? styles.replied : styles.pending}`}>
                  {message.admin_reply ? 'Replied' : 'Pending'}
                </span>
              </div>

              {/* Original message content */}
              <div className={styles.messageContent}>
                <h3>Your Message:</h3>
                <p>{message.message}</p>
              </div>

              {/* Admin's reply section - only shown if there's a reply */}
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