import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, cartsRes] = await Promise.all([
        axios.get('http://localhost:5000/admin/users', {
          headers: { 'X-Admin': 'true' }
        }),
        axios.get('http://localhost:5000/admin/carts', {
          headers: { 'X-Admin': 'true' }
        })
      ]);

      setUsers(usersRes.data);
      setCarts(cartsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin()) {
      return;
    }
    fetchData();
  }, [isAdmin]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/admin/users/${userId}`, {
        headers: { 'X-Admin': 'true' }
      });
      
      // Refresh the data after successful deletion
      fetchData();
    } catch (err) {
      setError('Failed to delete user: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteCart = async (cartId) => {
    if (!window.confirm('Are you sure you want to clear this user\'s cart?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/admin/carts/${cartId}`, {
        headers: { 'X-Admin': 'true' }
      });
      
      // Refresh the data after successful deletion
      fetchData();
    } catch (err) {
      setError('Failed to clear cart: ' + (err.response?.data?.error || err.message));
    }
  };

  if (!isAdmin()) {
    return (
      <div className={styles.errorContainer}>
        <h2>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Create a map of user carts for easy lookup
  const userCartsMap = new Map(carts.map(cart => [cart.user_id, cart]));

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles.adminInfo}>
          <img src={currentUser.avatar} alt={currentUser.name} className={styles.adminAvatar} />
          <span>Welcome, {currentUser.name}</span>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'carts' ? styles.active : ''}`}
          onClick={() => setActiveTab('carts')}
        >
          User Carts
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'users' ? (
          <div className={styles.usersSection}>
            <h2>User Management</h2>
            <div className={styles.usersGrid}>
              {users.map(user => (
                <div key={user.id} className={styles.userCard}>
                  <img 
                    src={user.profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                    alt={user.name} 
                    className={styles.userAvatar}
                  />
                  <div className={styles.userInfo}>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <span className={`${styles.role} ${styles[user.role]}`}>
                      {user.role}
                    </span>
                    <p className={styles.joinDate}>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.userActions}>
                    <button className={styles.actionButton}>Edit</button>
                    <button 
                      className={`${styles.actionButton} ${styles.delete}`}
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.role === 'admin'} // Prevent deleting other admins
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.cartsSection}>
            <h2>User Carts</h2>
            <div className={styles.cartsGrid}>
              {users.map(user => {
                const cart = userCartsMap.get(user.id);
                let cartItems = [];
                
                if (cart) {
                  try {
                    cartItems = JSON.parse(cart.items || '[]');
                  } catch (e) {
                    console.error('Failed to parse cart items:', e);
                  }
                }

                return (
                  <div key={user.id} className={styles.cartCard}>
                    <div className={styles.cartHeader}>
                      <img 
                        src={user.profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                        alt={user.name} 
                        className={styles.userAvatar}
                      />
                      <div className={styles.cartUserInfo}>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        <span className={`${styles.role} ${styles[user.role]}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className={styles.cartItems}>
                      {cartItems.length > 0 ? (
                        cartItems.map(item => (
                          <div key={item.id} className={styles.cartItem}>
                            <div className={styles.itemInfo}>
                              <h4>{item.name}</h4>
                              <p>Quantity: {item.quantity}</p>
                              <p>Price: ${item.price}</p>
                            </div>
                            <div className={styles.itemTotal}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyCart}>
                          <p>No items in cart</p>
                        </div>
                      )}
                    </div>
                    {cartItems.length > 0 && (
                      <>
                        <div className={styles.cartTotal}>
                          <span>Total:</span>
                          <span>
                            $
                            {cartItems
                              .reduce((total, item) => total + item.price * item.quantity, 0)
                              .toFixed(2)}
                          </span>
                        </div>
                        {cart && (
                          <div className={styles.cartActions}>
                            <button 
                              className={`${styles.actionButton} ${styles.delete}`}
                              onClick={() => handleDeleteCart(cart.cart_id)}
                            >
                              Clear Cart
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 