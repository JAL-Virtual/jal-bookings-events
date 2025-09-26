'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpIcon, ArrowDownIcon, ClockIcon } from '@heroicons/react/24/outline';
import { FilterCard } from './FilterCard';

export enum SlotTypeOptions {
  LANDING = 'landing',
  TAKEOFF = 'takeoff',
  TAKEOFF_LANDING = 'takeoff_landing'
}

interface SlotsQtdData {
  departure?: number;
  landing?: number;
  departureLanding?: number;
}

interface SlotTypeFilterProps {
  eventName: string;
  eventType: string;
  eventBanner?: string;
  slotsQtdData?: SlotsQtdData;
  selectedSlotType?: SlotTypeOptions | null;
  onSlotTypeChange: (newType: SlotTypeOptions) => void;
}

const getEventTypeName = (eventType: string): string => {
  switch (eventType.toLowerCase()) {
    case 'departure':
      return 'Departure Event';
    case 'arrival':
      return 'Arrival Event';
    case 'mixed':
      return 'Mixed Event';
    default:
      return 'Aviation Event';
  }
};

export const SlotTypeFilter: React.FC<SlotTypeFilterProps> = ({
  eventName,
  eventType,
  eventBanner,
  slotsQtdData,
  selectedSlotType,
  onSlotTypeChange
}) => {
  return (
    <nav className="relative bg-white dark:bg-gray-900">
      {eventBanner && (
        <div className="hidden dark:lg:block absolute rounded-md w-full h-48 opacity-10">
          <Image 
            src={eventBanner}
            alt={`${eventName} logo`}
            width={288}
            height={285}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      )}

      <div className="relative z-20 h-full flex flex-row md:flex-col justify-between md:justify-start items-center flex-wrap gap-8 px-6 pt-9">
        <div className="self-start">
          <h2 className="text-lg font-bold text-blue-600 dark:text-white">{eventName}</h2>
          <p className="text-md text-blue-500 dark:text-gray-300">{getEventTypeName(eventType)}</p>
        </div>
        
        {slotsQtdData?.landing && slotsQtdData.landing > 0 && (
          <FilterCard
            title="Arrivals"
            icon={<ArrowDownIcon className="w-6 h-6" />}
            quantity={slotsQtdData.landing}
            onClick={() => onSlotTypeChange(SlotTypeOptions.LANDING)}
            active={selectedSlotType === SlotTypeOptions.LANDING}
          />
        )}

        {slotsQtdData?.departure && slotsQtdData.departure > 0 && (
          <FilterCard
            title="Departures"
            icon={<ArrowUpIcon className="w-6 h-6" />}
            quantity={slotsQtdData.departure}
            onClick={() => onSlotTypeChange(SlotTypeOptions.TAKEOFF)}
            active={selectedSlotType === SlotTypeOptions.TAKEOFF}
          />
        )}

        {slotsQtdData?.departureLanding && slotsQtdData.departureLanding > 0 && (
          <FilterCard
            title="Departure & Arrival"
            icon={<ClockIcon className="w-6 h-6" />}
            quantity={slotsQtdData.departureLanding}
            onClick={() => onSlotTypeChange(SlotTypeOptions.TAKEOFF_LANDING)}
            active={selectedSlotType === SlotTypeOptions.TAKEOFF_LANDING}
          />
        )}
      </div>
    </nav>
  );
};
