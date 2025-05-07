import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password
      };

      console.log('Attempting login with payload:', { ...payload, password: '***' });

      const response = await axios.post('http://localhost:5000/auth/login', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Accept all status codes less than 500
        }
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        navigate('/');
      } else {
        setError(response.data.error || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login request failed:', error);
      if (error.response) {
        setError(error.response.data.error || 'Login failed');
      } else if (error.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default LoginSignup; 