'use client';

import React, { useState, useEffect } from 'react';
import { ImageUpload } from './ImageUpload';
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

interface SlotManagementProps {
  adminApiKey: string;
}

export const SlotManagement: React.FC<SlotManagementProps> = ({ adminApiKey }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotType, setSlotType] = useState<'DEPARTURE' | 'ARRIVAL'>('DEPARTURE');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showEditSlotModal, setShowEditSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Form states
  const [addSlotData, setAddSlotData] = useState({
    slotNumber: '',
    type: slotType,
    airline: '',
    flightNumber: '',
    aircraft: '',
    origin: '',
    destination: '',
    eobtEta: '',
    stand: ''
  });
  
  const [addSlotLoading, setAddSlotLoading] = useState(false);
  const [editSlotLoading, setEditSlotLoading] = useState(false);

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/events?adminApiKey=${adminApiKey}&t=${Date.now()}`, {
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
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots for selected event
  const fetchSlots = async () => {
    if (!selectedEvent) return;

    try {
      setError(null);
      const response = await fetch(`/api/slots?eventId=${selectedEvent.id}&type=${slotType}&adminApiKey=${adminApiKey}&t=${Date.now()}`, {
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
    } catch (err: any) {
      console.error('Error fetching slots:', err);
      setError(err.message || 'Network error occurred');
    }
  };

  // Handle add slot
  const handleAddSlot = async () => {
    if (!selectedEvent) return;

    try {
      setAddSlotLoading(true);
      setError(null);
      
      const response = await fetch('/api/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          ...addSlotData,
          adminApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setShowAddSlotModal(false);
        setAddSlotData({
          slotNumber: '',
          type: slotType,
          airline: '',
          flightNumber: '',
          aircraft: '',
          origin: '',
          destination: '',
          eobtEta: '',
          stand: ''
        });
        fetchSlots();
      } else {
        setError(data.error || 'Failed to add slot');
      }
    } catch (err: any) {
      console.error('Error adding slot:', err);
      setError(err.message || 'Network error occurred');
    } finally {
      setAddSlotLoading(false);
    }
  };

  // Handle edit slot
  const handleEditSlot = async () => {
    if (!editingSlot) return;

    try {
      setEditSlotLoading(true);
      setError(null);
      
      const response = await fetch('/api/slots', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingSlot,
          adminApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setShowEditSlotModal(false);
        setEditingSlot(null);
        fetchSlots();
      } else {
        setError(data.error || 'Failed to update slot');
      }
    } catch (err: any) {
      console.error('Error updating slot:', err);
      setError(err.message || 'Network error occurred');
    } finally {
      setEditSlotLoading(false);
    }
  };

  // Handle delete slot
  const handleDeleteSlot = async (slotId: string) => {
    try {
      setError(null);
      
      const response = await fetch('/api/slots', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: slotId,
          adminApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setShowDeleteConfirm(null);
        fetchSlots();
      } else {
        setError(data.error || 'Failed to delete slot');
      }
    } catch (err: any) {
      console.error('Error deleting slot:', err);
      setError(err.message || 'Network error occurred');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-900 text-green-300';
      case 'OCCUPIED': return 'bg-red-900 text-red-300';
      case 'RESERVED': return 'bg-yellow-900 text-yellow-300';
      case 'CANCELLED': return 'bg-gray-900 text-gray-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchSlots();
    }
  }, [selectedEvent, slotType]);

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
          <h2 className="text-2xl font-bold text-white">Slot Management</h2>
          <p className="text-gray-400">Manage departure and arrival slots for events</p>
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
          
          {/* Slot Type Selector */}
          {selectedEvent && (
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => {
                  setSlotType('DEPARTURE');
                  // Update form data with correct ICAO codes for departure
                  if (selectedEvent) {
                    setAddSlotData(prev => ({
                      ...prev,
                      type: 'DEPARTURE',
                      origin: selectedEvent.departure,
                      destination: selectedEvent.arrival
                    }));
                  }
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  slotType === 'DEPARTURE'
                    ? 'bg-yellow-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Departures
              </button>
              <button
                onClick={() => {
                  setSlotType('ARRIVAL');
                  // Update form data with correct ICAO codes for arrival
                  if (selectedEvent) {
                    setAddSlotData(prev => ({
                      ...prev,
                      type: 'ARRIVAL',
                      origin: selectedEvent.arrival,
                      destination: selectedEvent.departure
                    }));
                  }
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  slotType === 'ARRIVAL'
                    ? 'bg-yellow-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Arrivals
              </button>
            </div>
          )}
          
          {/* Add Slot Button */}
          {selectedEvent && (
            <button
              onClick={() => {
                setAddSlotData({
                  ...addSlotData,
                  type: slotType
                });
                setShowAddSlotModal(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add Slot
            </button>
          )}
        </div>
      </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Slot Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Airline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Flight Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aircraft</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">EOBT/ETA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {slots.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                      No {slotType.toLowerCase()} slots found. Add your first slot to get started.
                    </td>
                  </tr>
                ) : (
                  slots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">
                          {slot.slotNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-400 font-medium">{slot.airline || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{slot.flightNumber || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{slot.aircraft || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {slot.origin && slot.destination ? `${slot.origin} → ${slot.destination}` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-green-400">{slot.eobtEta ? `${slot.eobtEta}Z` : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-yellow-400">{slot.stand || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(slot.status)}`}>
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingSlot(slot);
                              setShowEditSlotModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(slot.id)}
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
      ) : (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400">Please select an event to manage slots</p>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddSlotModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Add New {slotType} Slot</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slot Number *</label>
                <input
                  type="text"
                  value={addSlotData.slotNumber}
                  onChange={(e) => setAddSlotData({...addSlotData, slotNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., 342326"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                <select
                  value={addSlotData.type}
                  onChange={(e) => setAddSlotData({...addSlotData, type: e.target.value as 'DEPARTURE' | 'ARRIVAL'})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="DEPARTURE">Departure</option>
                  <option value="ARRIVAL">Arrival</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Airline</label>
                <input
                  type="text"
                  value={addSlotData.airline}
                  onChange={(e) => setAddSlotData({...addSlotData, airline: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Japan Airlines"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Flight Number</label>
                <input
                  type="text"
                  value={addSlotData.flightNumber}
                  onChange={(e) => setAddSlotData({...addSlotData, flightNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., JL123"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Aircraft</label>
                <input
                  type="text"
                  value={addSlotData.aircraft}
                  onChange={(e) => setAddSlotData({...addSlotData, aircraft: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., B777-300ER"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Origin</label>
                <input
                  type="text"
                  value={addSlotData.origin}
                  onChange={(e) => setAddSlotData({...addSlotData, origin: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., RJTT"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
                <input
                  type="text"
                  value={addSlotData.destination}
                  onChange={(e) => setAddSlotData({...addSlotData, destination: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., KLAX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">EOBT/ETA</label>
                <div className="flex space-x-2">
                  <select
                    value={addSlotData.eobtEta ? addSlotData.eobtEta.split(':')[0] : ''}
                    onChange={(e) => {
                      const hour = e.target.value;
                      const minute = addSlotData.eobtEta ? addSlotData.eobtEta.split(':')[1] || '00' : '00';
                      setAddSlotData({...addSlotData, eobtEta: `${hour}:${minute}`});
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Hour</option>
                    {Array.from({length: 24}, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-400 flex items-center">:</span>
                  <select
                    value={addSlotData.eobtEta ? addSlotData.eobtEta.split(':')[1] || '00' : ''}
                    onChange={(e) => {
                      const minute = e.target.value;
                      const hour = addSlotData.eobtEta ? addSlotData.eobtEta.split(':')[0] || '00' : '00';
                      setAddSlotData({...addSlotData, eobtEta: `${hour}:${minute}`});
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Minute</option>
                    {Array.from({length: 60}, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-400 flex items-center">Z</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stand/Gate</label>
                <input
                  type="text"
                  value={addSlotData.stand}
                  onChange={(e) => setAddSlotData({...addSlotData, stand: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g., A12"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddSlotModal(false);
                  setAddSlotData({
                    slotNumber: '',
                    type: slotType,
                    airline: '',
                    flightNumber: '',
                    aircraft: '',
                    origin: '',
                    destination: '',
                    eobtEta: '',
                    stand: ''
                  });
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={addSlotLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSlot}
                disabled={addSlotLoading || !addSlotData.slotNumber}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {addSlotLoading ? 'Adding...' : 'Add Slot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {showEditSlotModal && editingSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Edit Slot</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slot Number *</label>
                <input
                  type="text"
                  value={editingSlot.slotNumber}
                  onChange={(e) => setEditingSlot({...editingSlot, slotNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                <select
                  value={editingSlot.type}
                  onChange={(e) => setEditingSlot({...editingSlot, type: e.target.value as 'DEPARTURE' | 'ARRIVAL'})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="DEPARTURE">Departure</option>
                  <option value="ARRIVAL">Arrival</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Airline</label>
                <input
                  type="text"
                  value={editingSlot.airline || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, airline: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Flight Number</label>
                <input
                  type="text"
                  value={editingSlot.flightNumber || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, flightNumber: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Aircraft</label>
                <input
                  type="text"
                  value={editingSlot.aircraft || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, aircraft: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Origin</label>
                <input
                  type="text"
                  value={editingSlot.origin || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, origin: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
                <input
                  type="text"
                  value={editingSlot.destination || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, destination: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">EOBT/ETA</label>
                <div className="flex space-x-2">
                  <select
                    value={editingSlot.eobtEta ? editingSlot.eobtEta.split(':')[0] : ''}
                    onChange={(e) => {
                      const hour = e.target.value;
                      const minute = editingSlot.eobtEta ? editingSlot.eobtEta.split(':')[1] || '00' : '00';
                      setEditingSlot({...editingSlot, eobtEta: `${hour}:${minute}`});
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Hour</option>
                    {Array.from({length: 24}, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-400 flex items-center">:</span>
                  <select
                    value={editingSlot.eobtEta ? editingSlot.eobtEta.split(':')[1] || '00' : ''}
                    onChange={(e) => {
                      const minute = e.target.value;
                      const hour = editingSlot.eobtEta ? editingSlot.eobtEta.split(':')[0] || '00' : '00';
                      setEditingSlot({...editingSlot, eobtEta: `${hour}:${minute}`});
                    }}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Minute</option>
                    {Array.from({length: 60}, (_, i) => (
                      <option key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-400 flex items-center">Z</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stand/Gate</label>
                <input
                  type="text"
                  value={editingSlot.stand || ''}
                  onChange={(e) => setEditingSlot({...editingSlot, stand: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={editingSlot.status}
                  onChange={(e) => setEditingSlot({...editingSlot, status: e.target.value as any})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowEditSlotModal(false);
                  setEditingSlot(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={editSlotLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSlot}
                disabled={editSlotLoading || !editingSlot.slotNumber}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {editSlotLoading ? 'Updating...' : 'Update Slot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Delete Slot</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this slot? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSlot(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
