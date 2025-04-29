import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./Components/CartContext";
import { UserProvider } from "./Components/UserContext";
import LoginSingup from "./Components/Assets/LoginSingup/LoginSingup";
import Home from "./Components/Home/Home";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import CentralPage from './Components/CentralPage/CentralPage.jsx';
import StorePage from "./Components/StorePage";
import CartPage from "./Components/CartPage";
import AdminDashboard from "./Components/AdminDashboard";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginSingup />} />
              <Route path="/signup" element={<LoginSingup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/central" element={<CentralPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
