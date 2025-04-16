import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginSingup.css";
import axios from 'axios';
import person from '../../Assets/person.png';
import email from '../../Assets/email.png';
import password from '../../Assets/password.png';

const AuthForm = () => {
  const navigate = useNavigate();

  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loadingAction, setLoadingAction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (selectedAction) => {
    setAction(selectedAction);
    setLoadingAction(selectedAction);
    setError(null);

    const endpoint = selectedAction === "Login" ? "/login" : "/signup";
    const payload = selectedAction === "Login"
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Sign Up" && (
          <div className="input">
            <img src={person} alt="person-icon" className="icon" />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        )}

        <div className="input">
          <img src={email} alt="email-icon" className="icon" />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="input">
          <img src={password} alt="password-icon" className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
      </div>

      {action === "Login" && (
        <div className="forgot-password">
          Lost Password?{" "}
          <span
            style={{ cursor: "pointer", color: "#007bff" }}
            onClick={() => navigate("/forgot-password")}
          >
            Click Here!
          </span>
        </div>
      )}

      {error && <div style={{ color: "red", textAlign: "center", marginTop: "15px" }}>{error}</div>}

      <div className="submit-container">
        <button
          className="submit"
          onClick={() => handleSubmit("Sign Up")}
          disabled={loadingAction !== null}
        >
          {loadingAction === "Sign Up" ? "Loading..." : "Sign Up"}
        </button>
        <button
          className="submit gray"
          onClick={() => handleSubmit("Login")}
          disabled={loadingAction !== null}
        >
          {loadingAction === "Login" ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
