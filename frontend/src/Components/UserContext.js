import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext); // Get the context  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially no user is logged in 


  const login = (userData) => {
    setUser(userData); // Set the user data to the state 

  };

  const logout = () => {
    setUser(null); // Set the user to null 
    localStorage.removeItem('token'); // Remove the token from the local storage 
  };

  const value = {
    user,
    setUser,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 