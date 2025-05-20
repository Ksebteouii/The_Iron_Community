import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import './Profile.css';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB max file size
const MAX_BIO_LENGTH = 300; // Max characters for bio
const API_BASE_URL = 'http://localhost:5000';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '',
    bio: '',
    gender: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Memoized fetch profile function
  const fetchProfile = useCallback(async () => {
    if (!user?.email) {
      setError('User information is missing. Please login again.');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/${user.email}`);
      if (response.data?.profile) {
        const profile = response.data.profile;
        setFormData({
          name: profile.name || user.name || '',
          profilePicture: profile.profile_picture || '',
          bio: profile.bio || '',
          gender: profile.gender || '',
          phoneNumber: profile.phone_number || ''
        });
        setUser({ ...user, ...profile });
      } else {
        setFormData(prev => ({
          ...prev,
          name: user.name || ''
        }));
      }
      setError(null);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setFormData(prev => ({
        ...prev,
        name: user.name || ''
      }));
      setError('Failed to load profile. Using basic information.');
    } finally {
      setIsInitialLoad(false);
    }
  }, [user, setUser]);

  // Initial profile load
  useEffect(() => {
    if (user?.email && isInitialLoad) {
      fetchProfile();
    }
  }, [fetchProfile, user, isInitialLoad]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleFileChange = (e) => {
    // get the file user selected 
    const file = e.target.files[0];
    if (!file) return; // if no file selected do nothing 
 // check if its an image 
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please select an image file.');
      return;
    }
     // check if its too big  

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 2MB limit. Please choose a smaller file.');
      return;
    }
    // if its a valid image, read it as a data url  (base6)
    const reader = new FileReader();
    reader.onloadend = () => {
      // update the form data with the new profile picture  
      setFormData(prev => ({
        ...prev,
        profilePicture: reader.result
      }));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const validateInputs = () => {
    if (!formData.name.trim()) {
      setError('Name cannot be empty.');
      return false;
    }
    if (formData.phoneNumber && !/^\+?[0-9\s-]{7,15}$/.test(formData.phoneNumber)) {
      setError('Invalid phone number format.');
      return false;
    }
    if (formData.bio.length > MAX_BIO_LENGTH) {
      setError(`Bio cannot exceed ${MAX_BIO_LENGTH} characters.`);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/profile`, {
        email: user.email,
        name: formData.name,
        profile_picture: formData.profilePicture,
        bio: formData.bio,
        gender: formData.gender,
        phone_number: formData.phoneNumber,
      });

      if (response.status === 200) {
        setUser({ ...user, ...formData });
        setSuccess('Profile updated successfully!');
        setError(null);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again later.');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  if (isInitialLoad) {
    return <div className="profile-container full-bg">Loading profile...</div>;
  }

  return (
    <div className="profile-container full-bg">
      <div className="profile-card">
        <h2>Your Profile</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-picture-section">
          <img
            src={formData.profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="profile-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <form className="profile-form" onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <label htmlFor="name" className="profile-label">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name"
            className="profile-input"
            disabled={loading}
          />

          <label htmlFor="gender" className="profile-label">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="profile-select"
            disabled={loading}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          <label htmlFor="phoneNumber" className="profile-label">Phone Number:</label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Your phone number"
            className="profile-input"
            disabled={loading}
          />

          <label htmlFor="bio" className="profile-label">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself"
            rows={4}
            className="profile-textarea"
            disabled={loading}
          />

          <button type="submit" className="profile-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
