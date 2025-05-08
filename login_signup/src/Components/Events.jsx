import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';
import './Events.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchEvents();
    }, []);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/events');
            setEvents(response.data.events);
            setError(null);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = async (eventId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/events/${eventId}`);
            setSelectedEvent(response.data.event);
            await fetchParticipants(eventId);
            setError(null);
        } catch (error) {
            console.error('Error fetching event details:', error);
            setError('Failed to load event details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipants = async (eventId) => {
        try {
            const response = await axios.get(`http://localhost:5000/events/${eventId}/participants`, {
                headers: getAuthHeader()
            });
            setParticipants(response.data.event.participants);
        } catch (error) {
            console.error('Error fetching participants:', error);
            setError('Failed to load participants. Please try again later.');
        }
    };

    const handleSignup = async (eventId) => {
        if (!user) {
            setError('Please log in to sign up for events');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`http://localhost:5000/events/${eventId}/signup`, {}, {
                headers: getAuthHeader()
            });
            setError(null);
            await handleEventClick(eventId);
            alert('Successfully signed up for the event!');
        } catch (error) {
            console.error('Error signing up for event:', error);
            setError(error.response?.data?.error || 'Failed to sign up for event');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSignup = async (eventId) => {
        try {
            setLoading(true);
            await axios.post(`http://localhost:5000/events/${eventId}/cancel`, {}, {
                headers: getAuthHeader()
            });
            await fetchParticipants(eventId);
            await fetchEvents();
            setError(null);
            alert('Successfully cancelled event signup!');
        } catch (error) {
            console.error('Error cancelling event signup:', error);
            setError(error.response?.data?.error || 'Failed to cancel event signup');
        } finally {
            setLoading(false);
        }
    };

    const isUserParticipant = () => {
        return selectedEvent && participants.some(p => p.id === user?.id);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="events-container">
            <h2>Upcoming Events</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="events-grid">
                {events.map(event => (
                    <div key={event.id} className="event-card" onClick={() => handleEventClick(event.id)}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                        <p>Location: {event.location}</p>
                        <p>Participants: {event.current_participants}/{event.max_participants || '∞'}</p>
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <div className="event-details">
                    <h3>{selectedEvent.title}</h3>
                    <p>{selectedEvent.description}</p>
                    <p>Date: {new Date(selectedEvent.date).toLocaleDateString()}</p>
                    <p>Location: {selectedEvent.location}</p>
                    
                    {user ? (
                        <button
                            onClick={() => isUserParticipant() 
                                ? handleCancelSignup(selectedEvent.id)
                                : handleSignup(selectedEvent.id)
                            }
                            className={isUserParticipant() ? 'cancel-button' : 'signup-button'}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : isUserParticipant() ? 'Cancel Signup' : 'Sign Up'}
                        </button>
                    ) : (
                        <p className="login-message">Please log in to sign up for events</p>
                    )}

                    <h4>Participants ({participants.length})</h4>
                    <div className="participants-list">
                        {participants.map(participant => (
                            <div key={participant.id} className="participant-card">
                                <img 
                                    src={participant.profile_picture || '/default-avatar.png'} 
                                    alt={participant.name}
                                    className="participant-avatar"
                                />
                                <div className="participant-info">
                                    <p>{participant.name}</p>
                                    <p>{participant.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events; 