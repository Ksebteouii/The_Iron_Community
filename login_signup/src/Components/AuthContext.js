import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Mock user data for testing
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@iron.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=random'
  },
  {
    id: 2,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://ui-avatars.com/api/?name=Test&background=random'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in mock data
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create user object without password
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      };

      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: MOCK_USERS.length + 1,
        name,
        email,
        password,
        role: 'user', // Default role for new signups
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      };

      // Add to mock data
      MOCK_USERS.push(newUser);

      // Create user object without password
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      };

      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from localStorage
      localStorage.removeItem('currentUser');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 