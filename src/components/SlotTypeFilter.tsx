"use client";

import Image from "next/image";
import { SlotTypeOptions } from '../types/SlotFilter';

interface SlotTypeFilterProps {
  eventName: string;
  eventBanner?: string;
  eventType: string;
  selectedSlotType: SlotTypeOptions | null;
  slotsQtdData: {
    departure?: number;
    landing?: number;
    departureLanding?: number;
  };
  onSlotTypeChange: (type: SlotTypeOptions) => void;
}

export function SlotTypeFilter({
  eventName,
  eventBanner,
  eventType,
  selectedSlotType,
  slotsQtdData,
  onSlotTypeChange
}: SlotTypeFilterProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        {eventBanner && (
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
            <Image 
              src={eventBanner} 
              alt={eventName}
              width={400}
              height={128}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {eventName}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {eventType}
        </p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Slot Types
        </h3>
        
        {slotsQtdData.departure && slotsQtdData.departure > 0 && (
          <button
            onClick={() => onSlotTypeChange(SlotTypeOptions.DEPARTURE)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedSlotType === SlotTypeOptions.DEPARTURE
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Departures ({slotsQtdData.departure})
          </button>
        )}
        
        {slotsQtdData.landing && slotsQtdData.landing > 0 && (
          <button
            onClick={() => onSlotTypeChange(SlotTypeOptions.LANDING)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedSlotType === SlotTypeOptions.LANDING
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Arrivals ({slotsQtdData.landing})
          </button>
        )}
        
        {slotsQtdData.departureLanding && slotsQtdData.departureLanding > 0 && (
          <button
            onClick={() => onSlotTypeChange(SlotTypeOptions.DEPARTURE_LANDING)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedSlotType === SlotTypeOptions.DEPARTURE_LANDING
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Round Trip ({slotsQtdData.departureLanding})
          </button>
        )}
      </div>
    </div>
  );
}