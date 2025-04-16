import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSingup from "./Components/Assets/LoginSingup/LoginSingup";
import Home from "./Components/Home/Home";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword"; // ⬅️ الجديد

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSingup />} />
          <Route path="/signup" element={<LoginSingup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ⬅️ هذا الجديد */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
