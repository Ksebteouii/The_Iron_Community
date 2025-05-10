import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import LoginSingup from './Components/Assets/LoginSingup/LoginSingup';
import Layout from './Components/Layout';
import AdminDashboard from './Components/AdminDashboard';
import Events from './Components/Events';
import Profile from './Components/Profile';
import Cart from './Components/Cart';
import ForgotPassword from './Components/Assets/LoginSingup/ForgotPassword';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginSingup />} />
          <Route path="/signup" element={<LoginSingup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/events" />} />
            <Route path="events" element={<Events />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
          </Route>

          <Route path="/admin" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App; 