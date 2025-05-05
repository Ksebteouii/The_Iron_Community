import React, { useState } from 'react';
import axios from 'axios';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/contact-messages', formData);
      setStatus('Message sent successfully!');
      setFormData({name: '', email: '', message: ''});
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-container full-bg">
      <div className="background-image">
        <img src="/images/hero-gear.png" alt="Background" />
      </div>
      <div className="contact-content">
        <div className="contact-header">
          <h2>Get in Touch</h2>
          <p className="contact-subtitle">We'd love to hear from you</p>
        </div>
        
        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Location</h3>
              <p>Hay Lhneya Makther Silyena</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>ksebteouii@gmail.com</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>+216 25 064 560</p>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form onSubmit={handleSubmit} className="contact-form">
            <h2 className="contact-form-title">Contact Us</h2>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Your Name"
              />
              <span className="focus-border"></span>
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Your Email"
              />
              <span className="focus-border"></span>
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Your Message"
                rows="5"
              ></textarea>
              <span className="focus-border"></span>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {status && (
          <div className="status-message success">
            <i className="fas fa-check-circle"></i>
            {status}
          </div>
        )}
        {error && (
          <div className="status-message error">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
