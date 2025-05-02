import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [carts, setCarts] = useState([]);
  const [editCartId, setEditCartId] = useState(null);
  const [editItems, setEditItems] = useState('');
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/carts', {
        headers: { 'X-Admin': 'true' } // For demo, send admin header
      });
      setCarts(response.data);
    } catch (error) {
      console.error('Fetch carts error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      alert('Failed to fetch carts: ' + errorMsg);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/contact-messages', {
        headers: { 'X-Admin': 'true' }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Fetch messages error:', error);
      alert('Failed to fetch messages: ' + (error.response?.data?.error || error.message));
    }
  };

  const toggleMessages = () => {
    if (!showMessages) {
      fetchMessages();
    }
    setShowMessages(!showMessages);
  };

  const handleEditClick = (cart) => {
    setEditCartId(cart.cart_id);
    setEditItems(cart.items);
  };

  const handleCancelEdit = () => {
    setEditCartId(null);
    setEditItems('');
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/admin/carts/${editCartId}`, { items: editItems }, {
        headers: { 'X-Admin': 'true' }
      });
      setEditCartId(null);
      setEditItems('');
      fetchCarts();
    } catch (error) {
      alert('Failed to update cart: ' + error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (cart_id) => {
    if (!window.confirm('Are you sure you want to delete this cart?')) return;
    try {
      await axios.delete(`http://localhost:5000/admin/carts/${cart_id}`, {
        headers: { 'X-Admin': 'true' }
      });
      fetchCarts();
    } catch (error) {
      alert('Failed to delete cart: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <h2>Admin Dashboard - User Carts</h2>
      <button onClick={toggleMessages} style={{ marginBottom: '20px' }}>
        {showMessages ? 'Hide Contact Messages' : 'View Contact Messages'}
      </button>
      {showMessages && (
        <div>
          <h3>Contact Messages</h3>
          <table border="1" cellPadding="8" cellSpacing="0" className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {messages.length > 0 ? (
                messages.map(msg => (
                  <tr key={msg.id}>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No messages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <table border="1" cellPadding="8" cellSpacing="0" className={styles.table}>
        <thead>
          <tr>
            <th>Cart ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {carts.map(cart => (
          <tr key={cart.cart_id}>
            <td>{cart.cart_id}</td>
            <td>{cart.user_name}</td>
            <td>{cart.user_email}</td>
            <td>
              <>
                {(() => {
                  try {
                    const items = JSON.parse(cart.items);
                    return (
                      <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
                        {items.map((item, index) => (
                          <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '6px' }} />
                            <span>{item.name} (Qty: {item.quantity})</span>
                          </li>
                        ))}
                      </ul>
                    );
                  } catch (e) {
                    return <pre>{cart.items}</pre>;
                  }
                })()}
              </>
            </td>
            <td>
              <button onClick={() => handleDelete(cart.cart_id)}>Delete</button>
            </td>
          </tr>
          ))}
          {carts.length === 0 && (
            <tr>
              <td colSpan="5">No carts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
