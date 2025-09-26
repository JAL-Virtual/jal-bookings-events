'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UTCClock } from './UTCClock';

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
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

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
  }, []);

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

  // Handle slot booking
  const handleBookSlot = async (slotId: string) => {
    if (!selectedEvent) return;

    try {
      setBookingLoading(slotId);
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
          slotId // Include slot ID for slot-specific booking
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh slots to update status
        await fetchSlots();
      } else {
        setError(data.error || 'Failed to book slot');
      }
    } catch (err: unknown) {
      console.error('Error booking slot:', err);
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setBookingLoading(null);
    }
  };

  // Filter slots based on search term
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
                      {searchTerm ? 'No slots match your search criteria.' : `No ${slotType.toLowerCase()} slots available.`}
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
    </div>
  );
};
