'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    refreshIntervalRef.current = interval;
    
    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
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
          We&apos;re preparing exciting aviation events for you. Check back soon for updates!
        </p>
        <div className="mt-6 text-sm text-gray-500">
          Japan Airlines Virtual • Event Booking Portal
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-700 ${className}`}>
      {/* Event Header */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-yellow-400 mb-1">{event.name}</h2>
            {event.airline && (
              <p className="text-lg text-white font-semibold">{event.airline}</p>
            )}
            {event.route && (
              <p className="text-sm text-gray-300 mt-1 font-mono">
                Route: {event.route}
              </p>
            )}
          </div>
          
          {/* Route and Time Info */}
          <div className="text-right ml-6">
            <div className="text-xl font-bold text-white">
              {event.origin || event.departure} → {event.destination || event.arrival}
            </div>
            <div className="text-sm text-gray-300">{formatDate(event.date)}</div>
            <div className="text-sm text-gray-300">{formatTime(event.time)}</div>
            {event.eobtEta && (
              <div className="text-xs text-gray-400 mt-1">{event.eobtEta}</div>
            )}
          </div>
        </div>
      </div>

      {/* Event Image - Enhanced Display */}
      {event.picture && (
        <div className="relative h-64 w-full overflow-hidden">
          <Image
            src={event.picture}
            alt={`${event.name} - Event Image`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            priority
          />
          {/* Image overlay with event details */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-white">
              <div className="text-sm font-medium text-gray-200 mb-1">
                {event.airline && `${event.airline} • `}
                {event.flightNumber && `Flight ${event.flightNumber}`}
              </div>
              {event.aircraft && (
                <div className="text-xs text-gray-300">
                  Aircraft: {event.aircraft}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Details */}
      <div className="p-6">
        {event.description && (
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {event.description}
          </p>
        )}

        {/* Flight Details Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {event.flightNumber && (
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Flight Number</div>
              <div className="text-white font-medium font-mono">{event.flightNumber}</div>
            </div>
          )}
          
          {event.aircraft && (
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Aircraft</div>
              <div className="text-white font-medium">{event.aircraft}</div>
            </div>
          )}
          
          {event.stand && (
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Stand/Gate</div>
              <div className="text-white font-medium">{event.stand}</div>
            </div>
          )}
        </div>

        {event.eobtEta && (
          <div className="bg-blue-500/10 rounded-lg p-3 mb-4 border border-blue-500/20">
            <div className="text-xs text-blue-400 uppercase tracking-wide mb-1">EOBT/ETA</div>
            <div className="text-white font-medium">{event.eobtEta}</div>
          </div>
        )}

        {/* Booking Status - Enhanced */}
        <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg p-4 border border-gray-600/50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-gray-300">Pilot Slots</div>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              event.status === 'ACTIVE' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {event.status}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-yellow-400">{event.currentBookings}</div>
            <div className="text-gray-400 text-lg">/</div>
            <div className="text-2xl font-bold text-white">{event.maxPilots}</div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-400">
                {Math.round((event.currentBookings / event.maxPilots) * 100)}%
              </div>
              <div className="text-xs text-gray-400">Full</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((event.currentBookings / event.maxPilots) * 100, 100)}%` 
              }}
            ></div>
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
