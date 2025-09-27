import React from 'react';
import Image from 'next/image';

export interface EventHeaderData {
  id: string;
  eventName: string;
  subtitle?: string;
  description: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  picture?: string;
  pilotBriefingUrl?: string;
}

interface EventHeaderProps {
  event: EventHeaderData;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">{event.eventName}</h1>
          <h2 className="text-xl font-bold text-white mb-2">{event.subtitle || ''}</h2>
        </div>
        
        {/* Event Details - Right Aligned */}
        <div className="text-white text-right ml-6">
          <div className="font-semibold text-base">{event.departure} → {event.arrival}</div>
          <div className="text-sm">{event.date}</div>
          <div className="text-sm">{event.time}</div>
        </div>
      </div>
      
      {/* Event Picture */}
      {event.picture && (
        <div className="mb-4">
          <Image 
            src={event.picture} 
            alt={event.eventName}
            width={800}
            height={192}
            className="w-full max-w-2xl h-48 object-cover rounded-lg"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <p className="text-white text-sm leading-relaxed max-w-4xl">
        {event.description}
      </p>
    </div>
  );
};
