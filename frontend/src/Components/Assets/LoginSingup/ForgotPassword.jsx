import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './LoginSingup.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: verification, 3: new password
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (step === 1) {
      try {
        const response = await axios.post('http://localhost:5000/forgot-password', { email });
        setMessage(response.data.message);
        setMaskedPhone(response.data.phone_number);
        setStep(2);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to process request');
      }
    } else if (step === 2) {
      try {
        const response = await axios.post('http://localhost:5000/verify-reset-code', {
          email,
          code: verificationCode
        });
        setResetToken(response.data.reset_token);
        setMessage(response.data.message);
        setStep(3);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to verify code');
      }
    } else if (step === 3) {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      try {
        await axios.post('http://localhost:5000/reset-password', {
          email,
          reset_token: resetToken,
          new_password: newPassword
        });
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to reset password');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Reset Password</h2>
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {step === 2 && (
            <>
              <div className={styles.info}>
                Verification code has been sent to your phone number ending in {maskedPhone}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className={styles.submitButton}>
            {step === 1 ? 'Send Code' : step === 2 ? 'Verify Code' : 'Reset Password'}
          </button>
        </form>

        <div className={styles.links}>
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 