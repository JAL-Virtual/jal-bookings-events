'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BookInfoMessage } from './BookInfoMessage';

interface Event {
  id: string;
  name: string;
  description?: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  picture?: string;
  route?: string;
  flightNumber?: string;
  aircraft?: string;
  origin?: string;
  destination?: string;
  eobtEta?: string;
  stand?: string;
  currentBookings: number;
  status: string;
  bookings: Booking[];
}

interface Booking {
  id: string;
  eventId: string;
  pilotId: string;
  pilotName: string;
  pilotEmail: string;
  jalId?: string;
  status: string;
  createdAt: string;
}

interface BookingPageProps {
  pilotId: string;
  pilotName: string;
  pilotEmail: string;
}

export const BookingPage: React.FC<BookingPageProps> = ({ pilotId, pilotName, pilotEmail }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'success'>('error');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEvent, setConfirmationEvent] = useState<Event | null>(null);
  const [userJalId, setUserJalId] = useState<string | null>(null);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/events?adminApiKey=29e2bb1d4ae031ed47b6`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events || []);
        setError(null);
      } else {
        setError('No events available');
      }
    } catch (err: unknown) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user bookings
  // Fetch user's JAL ID from API
  const fetchUserJalId = useCallback(async () => {
    try {
      const apiKey = localStorage.getItem('jal_api_key');
      if (!apiKey) return;

      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Extract JAL ID from user data (could be id, callsign, or username)
        const jalId = userData.id?.toString() || userData.callsign || userData.username;
        setUserJalId(jalId);
      }
    } catch (err: unknown) {
      console.error('Error fetching user JAL ID:', err);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await fetch(`/api/bookings?pilotId=${pilotId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err: unknown) {
      console.error('Error fetching bookings:', err);
    }
  }, [pilotId]);

  // Filter events based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => 
        event.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.destination?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [events, searchTerm]);

  const loadData = useCallback(async () => {
    await fetchEvents();
    await fetchBookings();
    await fetchUserJalId();
  }, [fetchEvents, fetchBookings, fetchUserJalId]);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    refreshIntervalRef.current = interval;
    
    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [loadData]);

  // Handle booking confirmation
  const handleBookEvent = async (eventId: string) => {
    // Check if already booked
    if (isEventBooked(eventId)) {
      handleError('You have already booked this event', 'warning');
      return;
    }

    // Find the event details for confirmation
    const event = events.find(e => e.id === eventId);
    if (!event) {
      handleError('Event not found', 'error');
      return;
    }

    // Show confirmation popup
    setConfirmationEvent(event);
    setShowConfirmation(true);
  };

  // Confirm booking after user confirms
  const confirmBooking = async () => {
    if (!confirmationEvent || !userJalId) {
      handleError('JAL ID not available. Please ensure you are logged in.', 'error');
      return;
    }

    try {
      setBookingLoading(confirmationEvent.id);
      setError(null);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: confirmationEvent.id,
          pilotId,
          pilotName,
          pilotEmail,
          jalId: userJalId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await fetchEvents(); // Refresh events to update booking counts
        await fetchBookings(); // Refresh bookings
        handleError('Event booked successfully!', 'success');
        
        // Keep success message visible longer for important feedback
        setTimeout(() => {
          setShowError(false);
        }, 5000); // Show for 5 seconds instead of 3
      } else {
        handleError(data.error || 'Failed to book event', 'error');
      }
    } catch (err: unknown) {
      console.error('Error booking event:', err);
      handleError(err instanceof Error ? err.message : 'Network error occurred', 'error');
    } finally {
      setBookingLoading(null);
      setShowConfirmation(false);
      setConfirmationEvent(null);
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    try {
      setError(null);
      
      const response = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          pilotId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh events to update booking counts
        await fetchBookings(); // Refresh bookings
      } else {
        handleError(data.error || 'Failed to cancel booking', 'error');
      }
    } catch (err: unknown) {
      console.error('Error cancelling booking:', err);
      handleError(err instanceof Error ? err.message : 'Network error occurred', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isEventBooked = (eventId: string) => {
    return bookings.some(booking => booking.eventId === eventId);
  };

  const getBookingForEvent = (eventId: string) => {
    return bookings.find(booking => booking.eventId === eventId);
  };


  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/20';
      case 'CONFIRMED': return 'text-green-400 bg-green-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/20';
      case 'COMPLETED': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Handle error display
  const handleError = (message: string, type: 'error' | 'warning' | 'success' = 'error') => {
    setError(message);
    setErrorType(type);
    setShowError(true);
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  // Handle error reset
  const handleErrorReset = () => {
    setShowError(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Flight Booking</h2>
          <p className="text-gray-400">Book your flights and manage your reservations</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Current Time */}
          <div className="text-white font-mono text-sm">
            {new Date().toLocaleTimeString('en-US', { 
              timeZone: 'UTC', 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })} UTC
          </div>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Flights"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm">Filter Table</span>
          </div>
        </div>
      </div>


      {/* Error Message */}
      {showError && error && (
        <BookInfoMessage
          header={errorType === 'error' ? 'Booking Error' : errorType === 'warning' ? 'Booking Warning' : 'Booking Success'}
          description={error}
          type={errorType}
          onErrorReset={handleErrorReset}
        />
      )}

      {/* Events List - Card Style */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-gray-400 text-lg">
              {searchTerm ? 'No flights match your search criteria.' : 'No events available right now. Stay tuned for new events!'}
            </div>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isBooked = isEventBooked(event.id);
            const booking = getBookingForEvent(event.id);
            
            return (
              <div key={event.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between">
                  {/* Left Side - Airline Logo & Flight Number */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">JAL</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg">
                        {event.flightNumber || event.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {event.aircraft || 'Aircraft TBD'}
                      </div>
                    </div>
                  </div>

                  {/* Middle - Route Information */}
                  <div className="flex-1 mx-8">
                    <div className="flex items-center justify-center space-x-4">
                      {/* Origin */}
                      <div className="text-center">
                        <div className="text-white font-semibold text-lg">
                          {event.origin || event.departure}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {event.departure}
                        </div>
                      </div>

                      {/* Flight Direction Arrow */}
                      <div className="flex items-center">
                        <div className="w-16 h-px bg-gray-500"></div>
                        <div className="mx-2 text-gray-400">→</div>
                        <div className="w-16 h-px bg-gray-500"></div>
                      </div>

                      {/* Destination */}
                      <div className="text-center">
                        <div className="text-white font-semibold text-lg">
                          {event.destination || event.arrival}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {event.arrival}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Time & Action */}
                  <div className="flex items-center space-x-6">
                    {/* Time Information */}
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {event.eobtEta || `EOBT: ${event.time}Z`}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {formatDate(event.date)}
                      </div>
                      {event.stand && (
                        <div className="text-gray-400 text-sm">
                          Stand: {event.stand}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-end space-y-2">
                      {isBooked && booking ? (
                        <div className="text-center">
                          <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                            booking.status === 'CONFIRMED' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-yellow-600 text-white'
                          }`}>
                            {booking.status}
                          </div>
                          {booking.jalId && (
                            <div className="text-blue-400 text-xs mt-1">
                              JAL ID: {booking.jalId}
                            </div>
                          )}
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBookEvent(event.id)}
                          disabled={bookingLoading === event.id || event.status !== 'ACTIVE'}
                          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-colors ${
                            event.status === 'ACTIVE'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          } ${bookingLoading === event.id ? 'opacity-50' : ''}`}
                        >
                          {bookingLoading === event.id ? 'Booking...' : 'Book by JAL ID'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bookings Summary */}
      {bookings.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Your Bookings</h3>
          <div className="space-y-3">
            {bookings.map((booking) => {
              const event = events.find(e => e.id === booking.eventId);
              if (!event) return null;
              
              return (
                <div key={booking.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <div>
                    <div className="text-white font-medium">{event.flightNumber || event.name}</div>
                    <div className="text-gray-400 text-sm">{event.departure} → {event.arrival}</div>
                    <div className="text-gray-400 text-sm">{formatDate(event.date)} at {event.time}Z</div>
                    {booking.jalId && (
                      <div className="text-blue-400 text-sm">JAL ID: {booking.jalId}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBookingStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showConfirmation && confirmationEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-lg">✈️</span>
                </div>
                <h3 className="text-xl font-bold text-white">Confirm Booking</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Are you sure you want to book this event?
                </p>
                
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                  <div className="text-white font-medium mb-2">{confirmationEvent.name}</div>
                  <div className="text-gray-300 text-sm mb-1">
                    {confirmationEvent.origin || confirmationEvent.departure} → {confirmationEvent.destination || confirmationEvent.arrival}
                  </div>
                  <div className="text-gray-300 text-sm mb-1">
                    {formatDate(confirmationEvent.date)} at {confirmationEvent.time}Z
                  </div>
                  {confirmationEvent.aircraft && (
                    <div className="text-gray-300 text-sm">
                      Aircraft: {confirmationEvent.aircraft}
                    </div>
                  )}
                  {confirmationEvent.flightNumber && (
                    <div className="text-gray-300 text-sm">
                      Flight: {confirmationEvent.flightNumber}
                    </div>
                  )}
                  {userJalId && (
                    <div className="text-blue-400 text-sm font-medium">
                      Booking with JAL ID: {userJalId}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setConfirmationEvent(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={bookingLoading === confirmationEvent.id}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {bookingLoading === confirmationEvent.id && (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {bookingLoading === confirmationEvent.id ? 'Booking...' : 'Confirm Booking by JAL ID'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
