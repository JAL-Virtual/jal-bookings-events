'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { SlotBookButton } from './SlotBookButton';

export enum SlotType {
  TAKEOFF = 'takeoff',
  LANDING = 'landing',
  TAKEOFF_LANDING = 'takeoff_landing'
}

export interface Slot {
  id: number;
  flightNumber?: string;
  aircraft?: string;
  origin: string;
  destination: string;
  slotTime: string;
  gate: string;
  type: SlotType;
  owner?: {
    vid: string;
  };
  isFixedOrigin: boolean;
  isFixedDestination: boolean;
}

export interface SlotScheduleData {
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
}

export interface AirportDetails {
  name: string;
  icao: string;
  iata?: string;
  city?: string;
  country?: string;
}

interface SlotsTableProps {
  slots: Slot[];
  airlineImages?: Array<Blob | null>;
  hasMoreFlights?: boolean;
  isFetchingMoreFlights?: boolean;
  airportDetailsMap?: Record<string, AirportDetails>;
  onSlotBook: (slotId: number, slotData?: SlotScheduleData) => void;
  onMoreFlightsRequested?: () => void;
}

interface FormValueMap {
  [key: number]: {
    flightNumber: string;
    aircraft: string;
    origin: string;
    destination: string;
  } | undefined;
}

const getSlotAirline = (slot: Slot): string => {
  // Extract airline from flight number (first 2-3 characters)
  if (slot.flightNumber) {
    return slot.flightNumber.substring(0, 2);
  }
  return 'XX';
};

export const SlotsTable: React.FC<SlotsTableProps> = ({
  slots,
  airlineImages,
  airportDetailsMap,
  hasMoreFlights,
  isFetchingMoreFlights,
  onSlotBook,
  onMoreFlightsRequested
}) => {
  const [formValues, setFormValues] = useState<FormValueMap>({});

  const handleLineInputChange = (slotId: number, evt: ChangeEvent<HTMLInputElement>) => {
    updateFormValues(slotId, evt.target.name as keyof SlotScheduleData, evt.target.value);
  };

  const updateFormValues = (slotId: number, key: keyof SlotScheduleData, value: string) => {
    setFormValues(prevState => {
      if (prevState === undefined) {
        prevState = {};
      }

      return {
        ...prevState,
        [slotId]: {
          ...prevState[slotId],
          [key]: value
        }
      } as FormValueMap;
    });
  };

  const handleSlotScheduling = (slotId: number) => {
    onSlotBook(slotId, formValues[slotId]);
  };

  const isBookable = (slot: Slot) => !slot.owner;

  const getAirportFullName = (icao: string, detailsMap?: Record<string, AirportDetails>) => {
    if (!detailsMap) {
      return "";
    }

    const airportDetails = detailsMap[icao];

    if (!airportDetails) {
      return "";
    }

    let airportName = airportDetails.name;
    if (airportName.indexOf(" / ") !== -1) {
      const [, airportFullName] = airportName.split(" / ");
      airportName = airportFullName;
    }

    return airportName;
  };

  useEffect(() => {
    slots.forEach((slot) => {
      if (!isBookable(slot)) {
        return;
      }

      if (!slot.isFixedDestination) {
        updateFormValues(slot.id, "destination", slot.destination);
      }
      if (!slot.isFixedOrigin) {
        updateFormValues(slot.id, "origin", slot.origin);
      }
    });
  }, [slots]);

  return (
    <div className="overflow-x-auto">
      <table className="border-separate text-center min-w-full" style={{ borderSpacing: "0 16px" }}>
        <thead>
          <tr className="text-xs text-gray-500 dark:text-gray-400 text-center font-semibold leading-7 whitespace-nowrap">
            <th aria-label="Airline logo" className="invisible min-w-24 w-24"></th>
            <th className="px-3">Flight Number</th>
            <th className="px-3">Aircraft</th>
            <th className="px-3">Origin</th>
            <th className="invisible w-10"></th>
            <th className="px-3">Destination</th>
            <th className="px-3">EOBT/ETA</th>
            <th className="px-3">Gate</th>
            <th className="invisible w-32"></th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, idx) => {
            const originAirportName = getAirportFullName(slot.origin, airportDetailsMap);
            const destinationAirportName = getAirportFullName(slot.destination, airportDetailsMap);
            const hasAirlineImage = airlineImages && airlineImages[idx];

            return (
              <tr
                key={slot.id}
                className="h-13 pt-4 bg-white dark:bg-gray-800 shadow-md text-blue-600 dark:text-white font-semibold text-sm whitespace-nowrap"
              >
                <td className={`p-0 rounded-l-lg ${hasAirlineImage ? "bg-white" : ""}`}>
                  {hasAirlineImage && (
                    <Image
                      className="mx-auto rounded-l-lg"
                      width={67}
                      height={16}
                      src={URL.createObjectURL(airlineImages[idx] as Blob)}
                      alt={`Logo ${getSlotAirline(slot)}`}
                    />
                  )}
                </td>

                {isBookable(slot) && !slot.flightNumber ? (
                  <td>
                    <label htmlFor={`flightNumber-${slot.id}`} className="sr-only">
                      Flight Number
                    </label>
                    <input
                      name="flightNumber"
                      id={`flightNumber-${slot.id}`}
                      type="text"
                      placeholder="Flight Number"
                      value={formValues[slot.id]?.flightNumber || ""}
                      onChange={(evt) => handleLineInputChange(slot.id, evt)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                ) : (
                  <td className="font-medium text-lg px-3">
                    {slot.flightNumber}
                  </td>
                )}

                {isBookable(slot) && !slot.aircraft ? (
                  <td>
                    <label htmlFor={`aircraft-${slot.id}`} className="sr-only">
                      Aircraft
                    </label>
                    <input
                      name="aircraft"
                      id={`aircraft-${slot.id}`}
                      type="text"
                      placeholder="Aircraft"
                      value={formValues[slot.id]?.aircraft || ""}
                      onChange={(evt) => handleLineInputChange(slot.id, evt)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                ) : (
                  <td className="px-3">
                    {slot.aircraft}
                  </td>
                )}

                {isBookable(slot) && !slot.isFixedOrigin ? (
                  <td>
                    <label htmlFor={`origin-${slot.id}`} className="sr-only">
                      Origin
                    </label>
                    <input
                      name="origin"
                      id={`origin-${slot.id}`}
                      type="text"
                      placeholder="Origin"
                      value={formValues[slot.id]?.origin || ""}
                      onChange={(evt) => handleLineInputChange(slot.id, evt)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                ) : (
                  <td className="text-center px-3" title={originAirportName}>
                    <span className="font-bold text-lg leading-6">{slot.origin || "ZZZZ"}</span>
                    <p className="w-32 mx-auto font-normal text-xs leading-3 text-center truncate">
                      {originAirportName}
                    </p>
                  </td>
                )}

                <td aria-hidden="true" className="px-3">
                  <div className="flex items-center">
                    <div className="inline-block border-b-2 border-dashed w-6 h-1 -ml-5" />
                    <div className="inline-block mx-auto w-4">
                      <PaperAirplaneIcon className="inline-block w-4 h-4" />
                    </div>
                    <div className="inline-block border-b-2 border-dashed w-6 h-1 -mr-5" />
                  </div>
                </td>

                {isBookable(slot) && !slot.isFixedDestination ? (
                  <td>
                    <label htmlFor={`destination-${slot.id}`} className="sr-only">
                      Destination
                    </label>
                    <input
                      name="destination"
                      id={`destination-${slot.id}`}
                      type="text"
                      placeholder="Destination"
                      value={formValues[slot.id]?.destination || ""}
                      onChange={(evt) => handleLineInputChange(slot.id, evt)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                ) : (
                  <td className="text-center px-3" title={destinationAirportName}>
                    <span className="font-bold text-lg leading-6">{slot.destination || "ZZZZ"}</span>
                    <p className="w-32 mx-auto font-normal text-xs leading-3 text-center truncate">
                      {destinationAirportName}
                    </p>
                  </td>
                )}

                <td className="px-3">
                  <span>{slot.type === SlotType.TAKEOFF ? 'EOBT' : 'ETA'}:&nbsp;</span>
                  <span>{slot.slotTime + (slot.slotTime.endsWith("Z") ? "" : "Z")}</span>
                </td>
                <td className="px-3">{slot.gate}</td>
                <td className="rounded-r-lg px-3">
                  <div className="w-24 mx-auto">
                    {!isBookable(slot) ? (
                      <SlotBookButton 
                        content={slot.owner!.vid} 
                        canBookFlight={false}
                      />
                    ) : (
                      <SlotBookButton 
                        content="Book Flight" 
                        onClick={() => handleSlotScheduling(slot.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        {hasMoreFlights && (
          <tfoot>
            <tr>
              <td colSpan={9}>
                <div className="w-full flex justify-center my-8">
                  {isFetchingMoreFlights ? (
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onMoreFlightsRequested && onMoreFlightsRequested()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Load More
                    </button>
                  )}
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};
