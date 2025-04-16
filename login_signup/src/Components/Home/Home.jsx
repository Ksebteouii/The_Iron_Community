import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Our Community</h1>
      <div className="auth-buttons">
        <Link to="/login" className="auth-btn">
          Login
        </Link>
        <Link to="/signup" className="auth-btn">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
