import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./LoginSingup.css";
import axios from 'axios';
import person from '../../Assets/person.png';
import email from '../../Assets/email.png';
import password from '../../Assets/password.png';
import { UserContext } from '../../UserContext';

const AuthForm = () => { 
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const { setUser } = useContext(UserContext); 

  const isSignup = location.pathname === "/signup"; // Check if the current path is the signup page 
  const action = isSignup ? "Sign Up" : "Login"; // Set the action to sign up or login 

  const [formData, setFormData] = useState({  
    name: "",
    email: "", 
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null); 

  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters, contain uppercase, lowercase, digit, and special character
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isSignup) {
      if (!formData.name.trim()) {
        setError("Name is required.");
        setLoading(false);
        return;
      }
      if (!validateEmail(formData.email)) {
        setError("Invalid email format.");
        setLoading(false);
        return;
      }
      if (!validatePassword(formData.password)) {
        setError("Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.");
        setLoading(false);
        return;
      }
    } else {
      if (!formData.email.trim() || !formData.password) {
        setError("Email and password are required.");
        setLoading(false);
        return;
      }
    }

    const endpoint = isSignup ? "/signup" : "/login"; // Set the endpoint to signup or login  
    const payload = isSignup 
      ? formData
      : { email: formData.email, password: formData.password }; // Set the payload to the form data  

    try {
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Login response:", response.data);

      if (isSignup) {
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        try {
          if (!response.data.user) {
            throw new Error("User data missing in login response");
          }
          setUser(response.data.user); // Store the user data in the context  
          localStorage.setItem('token', response.data.token); // Store the token in the local storage   
          if (response.data.user.is_admin) { 
            navigate("/admin");
          } else {
            navigate("/central");
          }
        } catch (e) {
          console.error("Error after login success:", e.stack || e);
          setError("An error occurred after login.");
        }
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          {isSignup && (
            <div className="input">
              <img src={person} alt="person-icon" className="icon" />
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          <div className="input">
            <img src={email} alt="email-icon" className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="input">
            <img src={password} alt="password-icon" className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>

        {!isSignup && (
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

        {error && (
          <div style={{ color: "red", textAlign: "center", marginTop: "15px" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: "green", textAlign: "center", marginTop: "15px" }}>
            {success}
          </div>
        )}

        <div className="submit-container">
          <button
            className="submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : action}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
