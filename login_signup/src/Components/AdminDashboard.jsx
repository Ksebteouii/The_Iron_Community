import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'carts', or 'messages' or 'events'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    console.log('Token in localStorage:', token); // Debug log
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      const [usersRes, cartsRes, messagesRes, eventsRes] = await Promise.all([
        axios.get('http://localhost:5000/admin/users', { headers }),
        axios.get('http://localhost:5000/admin/carts', { headers }),
        axios.get('http://localhost:5000/admin/contact-messages', { headers }),
        axios.get('http://localhost:5000/admin/events', { headers })
      ]);
      setUsers(usersRes.data);
      setCarts(cartsRes.data);
      setMessages(messagesRes.data);
      setEvents(eventsRes.data.events);
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.message === 'No authentication token found') {
        setError('Please log in to access the admin dashboard');
      } else if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
      } else {
        setError(error.response?.data?.error || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
        headers: getAuthHeader()
      });
      // Refresh the data after successful deletion
      fetchData();
    } catch (error) {
      alert('Failed to delete user: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDeleteCart = async (cart_id) => {
    if (!window.confirm('Are you sure you want to delete this cart?')) return;
    try {
      await axios.delete(`http://localhost:5000/admin/carts/${cart_id}`, {
        headers: getAuthHeader()
      });
      fetchData();
    } catch (error) {
      alert('Failed to delete cart: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`http://localhost:5000/admin/events/${eventId}`, {
        headers: getAuthHeader()
      });
      fetchData();
    } catch (error) {
      alert('Failed to delete event: ' + error.response?.data?.error || error.message);
    }
  };

  if (loading) {
    return <div className={styles.loadingSpinner}><div className={styles.spinner}></div></div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.adminDashboard}>
      <h2>Admin Dashboard</h2>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'carts' ? styles.active : ''}`}
          onClick={() => setActiveTab('carts')}
        >
          Carts
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'messages' ? styles.active : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'events' ? styles.active : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      {activeTab === 'users' && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Profile Picture</th>
                <th>Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Bio</th>
                <th>Admin</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <img 
                      src={user.profile?.profile_picture || 'https://via.placeholder.com/50'} 
                      alt={user.name}
                      className={styles.profilePicture}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                    />
                  </td>
                  <td>{user.profile?.name || user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.profile?.gender || 'Not specified'}</td>
                  <td>{user.profile?.phone_number || 'Not specified'}</td>
                  <td>{user.profile?.bio || 'No bio'}</td>
                  <td>{user.is_admin ? 'Yes' : 'No'}</td>
                  <td>{user.profile?.created_at ? new Date(user.profile.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className={styles.deleteButton}
                      disabled={user.is_admin}
                      title={user.is_admin ? "Cannot delete admin users" : "Delete user"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'carts' && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cart ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map(cart => (
                <tr key={cart.cart_id}>
                  <td>{cart.cart_id}</td>
                  <td>
                    <div className={styles.userInfo}>
                      <img 
                        src={cart.profile?.profile_picture || 'https://via.placeholder.com/30'} 
                        alt={cart.user_name}
                        className={styles.userAvatar}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/30';
                        }}
                      />
                      <div>
                        <div>{cart.user_name}</div>
                        <div className={styles.userEmail}>{cart.user_email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {(() => {
                      try {
                        const items = JSON.parse(cart.items);
                        return (
                          <ul className={styles.itemList}>
                            {items.map((item, index) => (
                              <li key={index} className={styles.itemRow}>
                                <img src={item.image} alt={item.name} className={styles.itemImage} />
                                <span className={styles.itemName}>{item.name}</span>
                                <span className={styles.itemQuantity}>(Qty: {item.quantity})</span>
                              </li>
                            ))}
                          </ul>
                        );
                      } catch (e) {
                        return <pre>{cart.items}</pre>;
                      }
                    })()}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDeleteCart(cart.cart_id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'events' && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Date</th>
                <th>Location</th>
                <th>Participants</th>
                <th>Max Participants</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
                  <td>{event.current_participants}</td>
                  <td>{event.max_participants || '∞'}</td>
                  <td>{new Date(event.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
