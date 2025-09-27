'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BookInfoMessage } from './BookInfoMessage';
import { UTCClock } from './UTCClock';
import { createFlightCalendarEvent, addToGoogleCalendar } from '../utils/calendarUtils';

interface Slot {
  id: string;
  eventId: string;
  slotNumber: string;
  type: 'DEPARTURE' | 'ARRIVAL';
  airline?: string;
  flightNumber?: string;
  aircraft?: string;
  origin?: string;
  destination?: string;
  eobtEta?: string;
  stand?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    name: string;
    departure: string;
    arrival: string;
  };
}

interface Event {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  picture?: string;
}

interface BookSlotProps {
  pilotId: string;
  pilotName: string;
  pilotEmail: string;
}

export const BookSlot: React.FC<BookSlotProps> = ({ pilotId, pilotName, pilotEmail }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotType, setSlotType] = useState<'DEPARTURE' | 'ARRIVAL'>('DEPARTURE');
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'success'>('error');
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationSlot, setConfirmationSlot] = useState<Slot | null>(null);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/events?t=${Date.now()}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events);
        if (data.events.length > 0 && !selectedEvent) {
          setSelectedEvent(data.events[0]);
        }
      } else {
        setError(data.error || 'Failed to fetch events');
      }
    } catch (err: unknown) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [selectedEvent]);

  // Fetch slots for selected event
  const fetchSlots = useCallback(async () => {
    if (!selectedEvent) return;

    try {
      setError(null);
      const response = await fetch(`/api/slots?eventId=${selectedEvent.id}&type=${slotType}&t=${Date.now()}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSlots(data.slots);
      } else {
        setError(data.error || 'Failed to fetch slots');
      }
    } catch (err: unknown) {
      console.error('Error fetching slots:', err);
      setError(err instanceof Error ? err.message : 'Network error occurred');
    }
  }, [selectedEvent, slotType]);

  // Handle slot booking confirmation
  const handleBookSlot = async (slotId: string) => {
    if (!selectedEvent) return;

    // Find the slot details for confirmation
    const slot = slots.find(s => s.id === slotId);
    if (!slot) {
      setError('Slot not found');
      return;
    }

    // Show confirmation popup
    setConfirmationSlot(slot);
    setShowConfirmation(true);
  };

  // Confirm slot booking after user confirms
  const confirmSlotBooking = async () => {
    if (!confirmationSlot || !selectedEvent) return;

    try {
      setBookingLoading(confirmationSlot.id);
      setError(null);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          pilotId,
          pilotName,
          pilotEmail,
          slotId: confirmationSlot.id // Include slot ID for slot-specific booking
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Refresh slots to update status
        await fetchSlots();
        
        // Create Google Calendar event
        try {
          const calendarEvent = createFlightCalendarEvent({
            eventName: selectedEvent.name,
            flightNumber: confirmationSlot.flightNumber,
            aircraft: confirmationSlot.aircraft,
            origin: confirmationSlot.origin || selectedEvent.departure,
            destination: confirmationSlot.destination || selectedEvent.arrival,
            departureTime: selectedEvent.time || new Date().toISOString(),
            arrivalTime: selectedEvent.time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
            slotNumber: confirmationSlot.slotNumber,
            pilotName: pilotName
          });
          
          // Add to Google Calendar
          addToGoogleCalendar(calendarEvent);
          
          handleError('Slot booked successfully! Added to Google Calendar.', 'success');
        } catch (calendarError) {
          console.error('Error adding to calendar:', calendarError);
          handleError('Slot booked successfully! (Calendar integration failed)', 'success');
        }
      } else {
        handleError(data.error || 'Failed to book slot', 'error');
      }
    } catch (err: unknown) {
      console.error('Error booking slot:', err);
      handleError(err instanceof Error ? err.message : 'Network error occurred', 'error');
    } finally {
      setBookingLoading(null);
      setShowConfirmation(false);
      setConfirmationSlot(null);
    }
  };

  // Handle error display
  const handleError = (message: string, type: 'error' | 'warning' | 'success' = 'error') => {
    setError(message);
    setErrorType(type);
    setShowError(true);
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  // Handle error reset
  const handleErrorReset = () => {
    setShowError(false);
    setError(null);
  };
  const filteredSlots = slots.filter(slot => 
    slot.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.airline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count slots by type
  const departureCount = slots.filter(slot => slot.type === 'DEPARTURE').length;
  const arrivalCount = slots.filter(slot => slot.type === 'ARRIVAL').length;

  useEffect(() => {
    fetchEvents();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchEvents();
    }, 30000);
    refreshIntervalRef.current = interval;
    
    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedEvent) {
      fetchSlots();
    }
  }, [selectedEvent, slotType, fetchSlots]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no events available, show the message
  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400">No events available right now. Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Book Slot</h2>
          <p className="text-gray-400">Select and book your preferred flight slot</p>
        </div>
        <div className="flex items-center space-x-4">
          <UTCClock />
          {/* Event Selector */}
          <select
            value={selectedEvent?.id || ''}
            onChange={(e) => {
              const event = events.find(evt => evt.id === e.target.value);
              setSelectedEvent(event || null);
            }}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error/Success Message */}
      {showError && error && (
        <BookInfoMessage
          header={errorType === 'error' ? 'Booking Error' : errorType === 'warning' ? 'Booking Warning' : 'Booking Success'}
          description={error}
          type={errorType}
          onErrorReset={handleErrorReset}
        />
      )}

      {/* Search and Filter */}
      {selectedEvent && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Flights"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Slot Type Selector */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setSlotType('DEPARTURE')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                slotType === 'DEPARTURE'
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span>Departures</span>
              </div>
              <div className="text-xs mt-1">{departureCount}</div>
            </button>
            <button
              onClick={() => setSlotType('ARRIVAL')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                slotType === 'ARRIVAL'
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span>Arrivals</span>
              </div>
              <div className="text-xs mt-1">{arrivalCount}</div>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Slots Table */}
      {selectedEvent ? (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Flight Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aircraft</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">EOBT/ETA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredSlots.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      {searchTerm ? 'No slots match your search criteria.' : `No ${slotType.toLowerCase()} slots available right now. Stay tuned for new events!`}
                    </td>
                  </tr>
                ) : (
                  filteredSlots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {slot.airline ? slot.airline.substring(0, 2).toUpperCase() : 'JAL'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm text-white font-medium">
                              {slot.flightNumber || 'TBD'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {slot.airline || 'Japan Airlines'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{slot.aircraft || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {slot.origin || selectedEvent.departure}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {slot.destination || selectedEvent.arrival}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-400">
                          {slot.eobtEta ? `${slot.eobtEta}Z` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium inline-block">
                          {slot.slotNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {slot.status === 'AVAILABLE' ? (
                          <button
                            onClick={() => handleBookSlot(slot.id)}
                            disabled={bookingLoading === slot.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {bookingLoading === slot.id ? 'Booking...' : 'Book Slot'}
                          </button>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            slot.status === 'OCCUPIED' ? 'bg-red-900 text-red-300' :
                            slot.status === 'RESERVED' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-gray-900 text-gray-300'
                          }`}>
                            {slot.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400">Please select an event to view available slots</p>
        </div>
      )}

      {/* Slot Booking Confirmation Modal */}
      {showConfirmation && confirmationSlot && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-lg">✈️</span>
                </div>
                <h3 className="text-xl font-bold text-white">Confirm Slot Booking</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Are you sure you want to book this slot?
                </p>
                
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                  <div className="text-white font-medium mb-2">{selectedEvent.name}</div>
                  <div className="text-gray-300 text-sm mb-1">
                    Slot: {confirmationSlot.flightNumber || 'N/A'}
                  </div>
                  <div className="text-gray-300 text-sm mb-1">
                    Type: {confirmationSlot.type}
                  </div>
                  <div className="text-gray-300 text-sm mb-1">
                    Aircraft: {confirmationSlot.aircraft || 'N/A'}
                  </div>
                  <div className="text-gray-300 text-sm mb-1">
                    Time: {selectedEvent.time || 'N/A'}
                  </div>
                  {confirmationSlot.airline && (
                    <div className="text-gray-300 text-sm">
                      Airline: {confirmationSlot.airline}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setConfirmationSlot(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmationSlot && selectedEvent) {
                      const calendarEvent = createFlightCalendarEvent({
                        eventName: selectedEvent.name,
                        flightNumber: confirmationSlot.flightNumber,
                        aircraft: confirmationSlot.aircraft,
                        origin: confirmationSlot.origin || selectedEvent.departure,
                        destination: confirmationSlot.destination || selectedEvent.arrival,
                        departureTime: selectedEvent.time || new Date().toISOString(),
                        arrivalTime: selectedEvent.time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                        slotNumber: confirmationSlot.slotNumber,
                        pilotName: pilotName
                      });
                      addToGoogleCalendar(calendarEvent);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Add to Calendar
                </button>
                <button
                  onClick={confirmSlotBooking}
                  disabled={bookingLoading === confirmationSlot.id}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {bookingLoading === confirmationSlot.id && (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {bookingLoading === confirmationSlot.id ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
