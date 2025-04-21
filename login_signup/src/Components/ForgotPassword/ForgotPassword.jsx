import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendResetLink = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace with API call to request reset
      setStep(2);
    } catch (err) {
      setError("We couldn't find an account with that email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace with API call to reset password
      alert("✅ Your password has been successfully reset.");
      navigate("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="graffiti-wall"></div>

      <div className="forgot-card">
        <h1 className="forgot-title">
          <span className="highlight-red">Reset</span>{" "}
          <span className="highlight-blue">Password</span>
        </h1>

        {step === 1 ? (
          <div className="form-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <button 
              onClick={handleSendResetLink}
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="new-password" className="input-label">New Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="new-password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
              />
              <button 
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <label htmlFor="confirm-password" className="input-label">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button 
              onClick={handleResetPassword}
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Confirm Reset"}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">⚠️ {error}</div>
        )}

        <div className="back-link">
          <button onClick={() => navigate('/login')} className="back-button">
            ← Back to Login
          </button>
        </div>

        <div className="contact-info">
          <p>text us on: <a href="mailto:ksebteouii@gmail.com">ksebteouii@gmail.com</a></p>
        </div>
      </div>

      <footer className="footer-tag">© 2025 The Crew</footer>
    </div>
  );
};

export default ForgotPassword;
