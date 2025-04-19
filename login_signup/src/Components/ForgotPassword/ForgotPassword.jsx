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
    if (!email) {
      setError("Yo, drop that email first!");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Simulate street-style "hacking" delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Your API call here
      setStep(2);
    } catch (err) {
      setError("Ain't no account with that email, homie.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match, try again!");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Your API call here
      alert("💥 Password reset! You're in.");
      navigate("/login");
    } catch (err) {
      setError("Failed! Server's acting sus.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-street-container">
      {/* Graffiti wall background */}
      <div className="graffiti-wall"></div>
      
      {/* Main card - like a street sign */}
      <div className="street-sign">
        <h1 className="title-tag">
          <span className="spray-red">RESET</span>
          <span className="spray-blue">PASSWORD</span>
        </h1>

        {step === 1 ? (
          <div className="street-inputs">
            <div className="tag-input">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                placeholder="YOUR@EMAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="street-field"
              />
            </div>
            <button 
              onClick={handleSendResetLink}
              className="street-button"
              disabled={loading}
            >
              {loading ? "HACKING..." : "SEND LINK →"}
            </button>
          </div>
        ) : (
          <div className="street-inputs">
            <div className="tag-input">
              <span className="input-icon">🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="NEW PASSWORD"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="street-field"
              />
              <button 
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            
            <div className="tag-input">
              <span className="input-icon">🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="CONFIRM IT"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="street-field"
              />
            </div>

            <button 
              onClick={handleResetPassword}
              className="street-button"
              disabled={loading}
            >
              {loading ? "RESETTING..." : "CONFIRM →"}
            </button>
          </div>
        )}

        {error && (
          <div className="street-error">
            ⚠️ {error}
          </div>
        )}

        <div className="back-link">
          <a onClick={() => navigate('/login')}>← Back to Login</a>
        </div>
      </div>

      {/* Graffiti tag at the bottom */}
      <div className="signature-tag">© THE CREW</div>
    </div>
  );
};

export default ForgotPassword;