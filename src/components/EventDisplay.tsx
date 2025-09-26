'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

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

interface EventDisplayProps {
  className?: string;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ className = '' }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchLatestEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.events && data.events.length > 0) {
          // Get the latest event (first in the sorted array)
          setEvent(data.events[0]);
        } else {
          setEvent(null);
        }
      } catch (err: unknown) {
        console.error('Error fetching latest event:', err);
        setError('Failed to load event data');
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEvent();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLatestEvent();
    }, 30000);
    setRefreshInterval(interval);
    
    // Cleanup interval on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    // If time is already in Z format, return as is
    if (timeString.includes('Z')) {
      return timeString;
    }
    // Otherwise, add Z suffix
    return `${timeString}Z`;
  };

  if (loading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading event information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg p-8 text-center ${className}`}>
        <div className="text-red-400 mb-2">⚠️</div>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`bg-gray-800 rounded-lg p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">✈️</div>
        <h3 className="text-2xl font-bold text-yellow-400 mb-2">Stay Tuned for New Events</h3>
        <p className="text-gray-400 text-lg">
          We're preparing exciting aviation events for you. Check back soon for updates!
        </p>
        <div className="mt-6 text-sm text-gray-500">
          Japan Airlines Virtual • Event Booking Portal
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {/* Event Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-yellow-400 mb-1">{event.name}</h2>
            {event.airline && (
              <p className="text-lg text-white font-semibold">{event.airline}</p>
            )}
          </div>
          
          {/* Route and Time Info */}
          <div className="text-right ml-6">
            <div className="text-xl font-bold text-white">
              {event.origin || event.departure} → {event.destination || event.arrival}
            </div>
            <div className="text-sm text-gray-300">{formatDate(event.date)}</div>
            <div className="text-sm text-gray-300">{formatTime(event.time)}</div>
          </div>
        </div>
      </div>

      {/* Event Image */}
      {event.picture && (
        <div className="relative h-48 w-full">
          <Image
            src={event.picture}
            alt={event.name}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Event Details */}
      <div className="p-6">
        {event.description && (
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {event.description}
          </p>
        )}

        {/* Flight Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {event.flightNumber && (
            <div>
              <span className="text-gray-400">Flight:</span>
              <span className="text-white ml-2 font-mono">{event.flightNumber}</span>
            </div>
          )}
          
          {event.aircraft && (
            <div>
              <span className="text-gray-400">Aircraft:</span>
              <span className="text-white ml-2">{event.aircraft}</span>
            </div>
          )}
          
          {event.eobtEta && (
            <div>
              <span className="text-gray-400">EOBT/ETA:</span>
              <span className="text-white ml-2">{event.eobtEta}</span>
            </div>
          )}
          
          {event.stand && (
            <div>
              <span className="text-gray-400">Stand:</span>
              <span className="text-white ml-2">{event.stand}</span>
            </div>
          )}
        </div>

        {/* Booking Status */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Pilot Slots:</span>
            <span className="text-white">
              {event.currentBookings} / {event.maxPilots}
            </span>
          </div>
          
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((event.currentBookings / event.maxPilots) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 flex justify-end">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.status === 'ACTIVE' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : event.status === 'INACTIVE'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {event.status}
          </span>
        </div>
      </div>
    </div>
  );
};
