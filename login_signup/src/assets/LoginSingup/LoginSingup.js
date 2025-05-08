import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import styles from './LoginSingup.module.css';

const LoginSingup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const userData = await login(formData.email, formData.password);
        setSuccess('Login successful!');
        
        // Check if user is admin and redirect accordingly
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          // If there's a redirect path in location state, use it
          const redirectPath = location.state?.from || '/central';
          navigate(redirectPath);
        }
      } else {
        await signup(formData.name, formData.email, formData.password);
        setSuccess('Account created successfully!');
        navigate('/central');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to continue' : 'Join our community'}</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                className={styles.input}
                placeholder=" "
                value={formData.name}
                onChange={handleChange}
                required
              />
              <label className={styles.label}>Full Name</label>
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              className={styles.input}
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Email</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              className={styles.input}
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label className={styles.label}>Password</label>
          </div>

          {isLogin && (
            <div className={styles.forgotPassword}>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          )}

          <button type="submit" className={styles.button}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className={styles.switchForm}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button onClick={toggleForm} className={styles.linkButton}>
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={toggleForm} className={styles.linkButton}>
                Sign In
              </button>
            </p>
          )}
        </div>

        <div className={styles.socialLogin}>
          <p>Or continue with</p>
          <div className={styles.socialButtons}>
            <button className={styles.socialButton}>
              <img src="https://www.google.com/favicon.ico" alt="Google" />
              Google
            </button>
            <button className={styles.socialButton}>
              <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSingup; 