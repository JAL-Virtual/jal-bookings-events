import React from 'react';
import { BookOpenIcon } from './Icons';

interface PilotBriefingCardProps {
  briefingUrl?: string;
  onBriefingClick?: () => void;
}

export const PilotBriefingCard: React.FC<PilotBriefingCardProps> = ({ 
  briefingUrl, 
  onBriefingClick 
}) => {
  const handleClick = () => {
    if (onBriefingClick) {
      onBriefingClick();
    } else if (briefingUrl) {
      window.open(briefingUrl, '_blank');
    }
  };

  return (
    <div 
      className="bg-gray-600 rounded-lg p-4 max-w-md hover:bg-gray-500 transition-colors cursor-pointer mb-3"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <BookOpenIcon className="w-6 h-6 text-white flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-white font-semibold text-base mb-1">Pilot Briefing</h3>
          <p className="text-white text-xs leading-relaxed">
            This document provides guidance for pilots and cabin crew about specific procedures for this event. Reading it is required.
          </p>
        </div>
      </div>
    </div>
  );
};
