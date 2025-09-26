'use client';

import React, { useState, useEffect } from 'react';
import { ImageUpload } from './ImageUpload';
import { SlotManagement } from './SlotManagement';

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
  airline?: string;
  flightNumber?: string;
  aircraft?: string;
  origin?: string;
  destination?: string;
  eobtEta?: string;
  stand?: string;
  maxPilots: number;
  currentBookings: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EventManagementProps {
  adminApiKey: string;
}

export const EventManagement: React.FC<EventManagementProps> = ({ adminApiKey }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showViewBookings, setShowViewBookings] = useState(false);
  const [selectedEventForBookings, setSelectedEventForBookings] = useState<Event | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [addEventData, setAddEventData] = useState({
    name: '',
    description: '',
    departure: '',
    arrival: '',
    date: '',
    time: '',
    picture: '',
    route: '',
    airline: '',
    maxPilots: 10
  });
  const [addEventLoading, setAddEventLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'events' | 'slots'>('events');

  // Fetch bookings for an event
  const fetchBookings = async (eventId: string) => {
    try {
      setBookingsLoading(true);
      setError(null);
      const response = await fetch(`/api/bookings?eventId=${eventId}&adminApiKey=${adminApiKey}&t=${Date.now()}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        setError(data.error || 'Failed to fetch bookings');
        setBookings([]);
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Network error occurred');
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events with adminApiKey:', adminApiKey);
      const response = await fetch(`/api/events?adminApiKey=${adminApiKey}&t=${Date.now()}`, {
        cache: 'no-store' // Force fresh fetch
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched events data:', data);
      
      if (data.success) {
        setEvents(data.events || []);
        console.log('Set events:', data.events);
        setError(null);
      } else {
        setError('No events have been created yet');
      }
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError('No events have been created yet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [adminApiKey]);

  // Handle add event
  const handleAddEvent = async () => {
    try {
      setAddEventLoading(true);
      setError(null);
      
      const response = await fetch('/api/events/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...addEventData,
          adminApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh the list
        setShowAddEventModal(false);
        setAddEventData({
          name: '',
          description: '',
          departure: '',
          arrival: '',
          date: '',
          time: '',
          picture: '',
          route: '',
          airline: '',
          maxPilots: 10
        });
      } else {
        setError(data.error || 'Failed to add event');
      }
    } catch (err: any) {
      console.error('Error adding event:', err);
      setError(err.message || 'Network error occurred');
    } finally {
      setAddEventLoading(false);
    }
  };



  // Handle edit event
  const handleEditEvent = async (eventData: Partial<Event>) => {
    if (!editingEvent) return;

    try {
      setError(null);
      
      // Prepare the data to send, filtering out undefined values
      const dataToSend: any = {
        id: editingEvent.id,
        adminApiKey,
      };

      // Only include fields that have actual values
      if (eventData.name !== undefined) dataToSend.name = eventData.name;
      if (eventData.description !== undefined) dataToSend.description = eventData.description;
      if (eventData.departure !== undefined) dataToSend.departure = eventData.departure;
      if (eventData.arrival !== undefined) dataToSend.arrival = eventData.arrival;
      if (eventData.date !== undefined && eventData.date !== '') {
        dataToSend.date = eventData.date;
      }
      if (eventData.time !== undefined) dataToSend.time = eventData.time;
      if (eventData.picture !== undefined) dataToSend.picture = eventData.picture;
      if (eventData.route !== undefined) dataToSend.route = eventData.route;
      if (eventData.flightNumber !== undefined) dataToSend.flightNumber = eventData.flightNumber;
      if (eventData.aircraft !== undefined) dataToSend.aircraft = eventData.aircraft;
      if (eventData.origin !== undefined) dataToSend.origin = eventData.origin;
      if (eventData.destination !== undefined) dataToSend.destination = eventData.destination;
      if (eventData.eobtEta !== undefined) dataToSend.eobtEta = eventData.eobtEta;
      if (eventData.stand !== undefined) dataToSend.stand = eventData.stand;
      if (eventData.status !== undefined) dataToSend.status = eventData.status;

      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh the list
        setEditingEvent(null);
      } else {
        setError(data.error || 'Failed to update event');
      }
    } catch (err: any) {
      console.error('Error updating event:', err);
      setError(err.message || 'Network error occurred');
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      setError(null);
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: eventId,
          adminApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchEvents(); // Refresh the list
        setShowDeleteConfirm(null);
      } else {
        setError(data.error || 'Failed to delete event');
      }
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Network error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-400/20';
      case 'INACTIVE': return 'text-red-400 bg-red-400/20';
      case 'CANCELLED': return 'text-gray-400 bg-gray-400/20';
      case 'COMPLETED': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Event Management</h2>
          <p className="text-gray-400">Create and manage events and slots for the platform</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* View Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('events')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'events'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setCurrentView('slots')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'slots'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Slots
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddEventModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Add Event
          </button>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
          <p className="text-blue-400">{error}</p>
        </div>
      )}

      {/* Conditional Content */}
      {currentView === 'events' ? (
        <>
          {/* Events Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pilot Slots</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No events found. Create your first event to get started.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          {event.picture && (
                            <img
                              src={event.picture}
                              alt={event.name}
                              className="w-12 h-12 object-cover rounded-lg border border-gray-600"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-white">{event.name}</div>
                            {event.description && (
                              <div className="text-sm text-gray-400 truncate max-w-xs">{event.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{formatDate(event.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{event.time}Z</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <span className="text-green-400">{event.currentBookings}</span>
                        <span className="text-gray-400">/{event.maxPilots}</span>
                      </div>
                      <div className="text-xs text-gray-400">pilots</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingEvent(event)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(event.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slots Section */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-bold text-white">Pilot Slots Management</h3>
          <p className="text-gray-400 text-sm">Manage pilot slots and bookings for events</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pilot Slots</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No events found. Create your first event to manage pilot slots.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {event.picture && (
                          <img
                            src={event.picture}
                            alt={event.name}
                            className="w-10 h-10 object-cover rounded border border-gray-600"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">{event.name}</div>
                          <div className="text-sm text-gray-400">{event.departure} → {event.arrival}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{formatDate(event.date)}</div>
                      <div className="text-sm text-gray-400">{event.time}Z</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <span className="text-green-400 font-medium">{event.maxPilots}</span>
                        <span className="text-gray-400"> slots</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <span className="text-blue-400 font-medium">{event.currentBookings}</span>
                        <span className="text-gray-400">/{event.maxPilots}</span>
                      </div>
                      <div className="text-xs text-gray-400">pilots booked</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.status === 'ACTIVE' ? 'bg-green-900 text-green-300' :
                        event.status === 'INACTIVE' ? 'bg-gray-900 text-gray-300' :
                        event.status === 'CANCELLED' ? 'bg-red-900 text-red-300' :
                        'bg-blue-900 text-blue-300'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedEventForBookings(event);
                            setShowViewBookings(true);
                            fetchBookings(event.id);
                          }}
                          className="text-green-400 hover:text-green-300"
                          title="View Bookings"
                        >
                          View Bookings
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Add New Event</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
                <input
                  type="text"
                  value={addEventData.name}
                  onChange={(e) => setAddEventData({...addEventData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder=""
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={addEventData.description}
                  onChange={(e) => setAddEventData({...addEventData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder=""
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Departure *</label>
                <input
                  type="text"
                  value={addEventData.departure}
                  onChange={(e) => setAddEventData({...addEventData, departure: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder=""
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Arrival *</label>
                <input
                  type="text"
                  value={addEventData.arrival}
                  onChange={(e) => setAddEventData({...addEventData, arrival: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder=""
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
                <input
                  type="date"
                  value={addEventData.date}
                  onChange={(e) => setAddEventData({...addEventData, date: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time (Zulu) *</label>
                <input
                  type="time"
                  value={addEventData.time}
                  onChange={(e) => setAddEventData({...addEventData, time: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Image</label>
                <ImageUpload
                  value={addEventData.picture}
                  onChange={(url) => setAddEventData({...addEventData, picture: url})}
                  adminApiKey={adminApiKey}
                  disabled={addEventLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Route</label>
                <input
                  type="text"
                  value={addEventData.route}
                  onChange={(e) => setAddEventData({...addEventData, route: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder=""
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Airline</label>
                <input
                  type="text"
                  value={addEventData.airline}
                  onChange={(e) => setAddEventData({...addEventData, airline: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder=""
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Pilot Slots *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={addEventData.maxPilots}
                  onChange={(e) => setAddEventData({...addEventData, maxPilots: parseInt(e.target.value) || 10})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddEventModal(false);
                  setAddEventData({
                    name: '',
                    description: '',
                    departure: '',
                    arrival: '',
                    date: '',
                    time: '',
                    picture: '',
                    route: '',
                    airline: '',
                    maxPilots: 10
                  });
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={addEventLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={addEventLoading || !addEventData.name || !addEventData.departure || !addEventData.arrival || !addEventData.date || !addEventData.time}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {addEventLoading ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Edit Event</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
                <input
                  type="text"
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Event Descriptions</label>
                <textarea
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Departure *</label>
                <input
                  type="text"
                  value={editingEvent.departure}
                  onChange={(e) => setEditingEvent({...editingEvent, departure: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Arrival *</label>
                <input
                  type="text"
                  value={editingEvent.arrival}
                  onChange={(e) => setEditingEvent({...editingEvent, arrival: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
                <input
                  type="date"
                  value={editingEvent.date ? new Date(editingEvent.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time (Zulu) *</label>
                <input
                  type="time"
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Images</label>
                <ImageUpload
                  value={editingEvent.picture || ''}
                  onChange={(url) => setEditingEvent({...editingEvent, picture: url})}
                  adminApiKey={adminApiKey}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Routes</label>
                <input
                  type="text"
                  value={editingEvent.route || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, route: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., ODAXA1D ODAXA UH899 IBALU UR7"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Pilot Slots *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editingEvent.maxPilots || 10}
                  onChange={(e) => setEditingEvent({...editingEvent, maxPilots: parseInt(e.target.value) || 10})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditEvent(editingEvent)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Update Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteEvent(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Bookings Modal */}
      {showViewBookings && selectedEventForBookings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                Bookings for {selectedEventForBookings.name}
              </h3>
              <button
                onClick={() => {
                  setShowViewBookings(false);
                  setSelectedEventForBookings(null);
                  setBookings([]);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {bookingsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No bookings found for this event.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Airlines</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Flight Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Departure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Arrival</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">EOBT/ETA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Book By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {bookings.map((booking, index) => (
                      <tr key={booking.id || index} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-blue-400 font-medium">{booking.airline || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{booking.flightNumber || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{booking.origin || selectedEventForBookings.departure}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{booking.destination || selectedEventForBookings.arrival}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-green-400">{booking.eobtEta ? `${booking.eobtEta}Z` : '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-yellow-400">{booking.stand || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-purple-400 font-medium">{booking.pilotId || '-'}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      ) : (
        <SlotManagement adminApiKey={adminApiKey} />
      )}

    </div>
  );
};
