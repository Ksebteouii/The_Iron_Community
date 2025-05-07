import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./Components/CartContext";
import { UserProvider } from "./Components/UserContext";
import LoginSingup from "./Components/Assets/LoginSingup/LoginSingup";
import Home from "./Components/Home/Home";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import StorePage from "./Components/StorePage";
import CartPage from "./Components/CartPage";
import AdminDashboard from "./Components/AdminDashboard";
import ContactUs from "./Components/ContactUs/ContactUs";
import AboutUs from "./Components/AboutUs/AboutUs";
import Profile from './Components/Profile/Profile';
import NavBar from './Components/NavBar';
import Central from './Components/Central/Central';
import Events from './Components/Events/Events';
import EventDetail from './Components/Events/EventDetail';

// Create a wrapper component to handle NavBar visibility
const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/login', '/signup', '/forgot-password'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <NavBar />}
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSingup />} />
          <Route path="/signup" element={<LoginSingup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/central" element={<Central />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
