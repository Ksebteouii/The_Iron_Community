import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';
import AdminEvents from './Admin/AdminEvents';

const DEFAULT_PROFILE_IMAGE = 'https://placehold.co/50x50?text=User';
const DEFAULT_ITEM_IMAGE = 'https://placehold.co/100x100?text=Item';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
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
      const [usersRes, cartsRes, messagesRes] = await Promise.all([
        axios.get('http://localhost:5000/admin/users', { headers }),
        axios.get('http://localhost:5000/admin/carts', { headers }),
        axios.get('http://localhost:5000/admin/contact-messages', { headers })
      ]);
      setUsers(usersRes.data);
      setCarts(cartsRes.data);
      setMessages(messagesRes.data);
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

  const handleReplyClick = (message) => {
    setSelectedMessage(message);
    setReplyText(message.admin_reply || '');
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;

    try {
      const headers = getAuthHeader();
      const response = await axios.post(`http://localhost:5000/api/admin/contact-messages/${selectedMessage.id}/reply`, {
        reply: replyText
      }, { headers });
      
      if (response.data.message === 'Reply saved successfully') {
        fetchData();
        setSelectedMessage(null);
        setReplyText('');
      } else {
        throw new Error(response.data.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Reply error:', error);
      alert('Failed to send reply: ' + (error.response?.data?.error || error.message));
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
                      src={user.profile?.profile_picture || DEFAULT_PROFILE_IMAGE} 
                      alt={user.name}
                      className={styles.profilePicture}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_PROFILE_IMAGE;
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
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carts.map(cart => (
                <tr key={cart.cart_id}>
                  <td>{cart.cart_id}</td>
                  <td>
                    <img
                      src={cart.profile?.profile_picture || DEFAULT_PROFILE_IMAGE}
                      alt={cart.user_name || 'User'}
                      className={styles.profilePicture}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_PROFILE_IMAGE;
                      }}
                    />
                  </td>
                  <td>{cart.user_name || 'Unknown User'}</td>
                  <td>{cart.user_email || 'Unknown Email'}</td>
                  <td>
                    {cart.items ? (
                      <div className={styles.cartItems}>
                        {JSON.parse(cart.items).map((item, index) => (
                          <div key={index} className={styles.cartItem}>
                            <img
                              src={item.image || DEFAULT_ITEM_IMAGE}
                              alt={item.name}
                              className={styles.itemImage}
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_ITEM_IMAGE;
                              }}
                            />
                            <span>{item.name} (${item.price})</span>
                          </div>
                        ))}
                      </div>
                    ) : 'No items'}
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
                <th>Admin Reply</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(message => (
                <tr key={message.id}>
                  <td>{message.name}</td>
                  <td>{message.email}</td>
                  <td>{message.message}</td>
                  <td>
                    {message.admin_reply ? (
                      <div className={styles.replyText}>Done</div>
                    ) : (
                      <div className={styles.noReply}>No reply yet</div>
                    )}
                  </td>
                  <td>{new Date(message.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleReplyClick(message)}
                      className={styles.replyButton}
                    >
                      {message.admin_reply ? 'Edit Reply' : 'Reply'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Reply Modal */}
          {selectedMessage && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <div className={styles.modalHeader}>
                  <h3>Reply to Message</h3>
                  <button onClick={() => setSelectedMessage(null)} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.modalContent}>
                  <div className={styles.messageDetails}>
                    <p><strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                    <p><strong>Message:</strong> {selectedMessage.message}</p>
                  </div>
                  <form onSubmit={handleReplySubmit} className={styles.replyForm}>
                    <div className={styles.formGroup}>
                      <label>Your Reply:</label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                        placeholder="Type your reply here..."
                      />
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.saveButton}>
                        {selectedMessage.admin_reply ? 'Update Reply' : 'Send Reply'}
                      </button>
                      <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={() => setSelectedMessage(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'events' && (
        <AdminEvents />
      )}
    </div>
  );
};

export default AdminDashboard;
