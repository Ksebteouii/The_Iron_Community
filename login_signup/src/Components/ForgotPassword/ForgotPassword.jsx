import React from 'react';
import './ForgotPassword.css'; 

const ForgotPassword = () => {
  return (
    <div className="container">
      <h2 className="text">Reset Your Password</h2>
      <div className="inputs">
        <div className="input">
          <input type="email" placeholder="Enter your email" />
        </div>
      </div>
      <div className="submit">Send Reset Link</div>
    </div>
  );
};

export default ForgotPassword;
