'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  eventId: number;
  imageSrc: string;
  eventName: string;
  eventType: string;
  description: string;
  tbd?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  eventId, 
  imageSrc, 
  eventName, 
  eventType, 
  description, 
  tbd = false 
}) => {
  const MAX_DESC_LENGTH = 160;

  return (
    <div className={`flex flex-col w-72 font-bold ${tbd ? "cursor-not-allowed" : ""}`}>
      <div className="relative">
        <Image 
          src={imageSrc}
          alt={`${eventName} logo`}
          width={288}
          height={192}
          className={`rounded-md w-full h-48 aspect-auto object-cover ${tbd ? "blur" : ""}`} 
        />

        {tbd && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-white font-semibold">
            Coming Soon
          </span>
        )}
      </div>

      <h2 className="mt-3 text-blue-600 dark:text-white text-[2rem] font-bold">
        {tbd ? (
          eventName
        ) : (
          <Link 
            href={`/event/${eventId}`}
            className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
          >
            {eventName}
          </Link>
        )}
      </h2>
      
      <p className="text-blue-500 dark:text-gray-300 text-sm font-medium">
        {eventType}
      </p>
      
      <p className="mt-3 text-gray-600 dark:text-gray-400 max-h-32 text-sm leading-relaxed">
        {description.length > MAX_DESC_LENGTH 
          ? description.substring(0, MAX_DESC_LENGTH) + "..." 
          : description
        }
      </p>
    </div>
  );
};
