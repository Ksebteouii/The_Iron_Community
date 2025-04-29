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

  const isSignup = location.pathname === "/signup";
  const action = isSignup ? "Sign Up" : "Login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isSignup ? "/signup" : "/login";
    const payload = isSignup
      ? formData
      : { email: formData.email, password: formData.password };

      try {
        const response = await axios.post(
          `http://localhost:5000${endpoint}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Login response:", response.data);

        if (isSignup) {
          navigate("/login"); // redirect to login after successful signup
        } else {
          try {
            // Save user info including is_admin flag to context
            if (!response.data.user) {
              throw new Error("User data missing in login response");
            }
            setUser(response.data.user);
            if (response.data.user.is_admin) {
              navigate("/admin"); // redirect admin to admin dashboard
            } else {
              navigate("/central"); // redirect normal user to central page
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
