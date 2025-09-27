"use client";

import Image from "next/image";

interface SlotsTableProps {
  slots: Slot[];
  airlineImages: (string | null)[];
  onSlotBook: (slotId: number, slotData?: unknown) => void;
  hasMoreFlights: boolean;
  isFecthingMoreFlights: boolean;
  airportDetailsMap: Record<string, AirportDetails>;
  onMoreFlightsRequested: () => void;
}

export function SlotsTable({
  slots,
  airlineImages,
  onSlotBook,
  hasMoreFlights,
  isFecthingMoreFlights,
  airportDetailsMap,
  onMoreFlightsRequested
}: SlotsTableProps) {
  const handleSlotScheduling = (slotId: number) => {
    onSlotBook(slotId);
  };

  const isBookable = (slot: Slot) => {
    return !slot.owner && slot.bookingStatus === 'available';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Flight
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Route
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Gate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {slots.map((slot, index) => {
            const originAirportName = airportDetailsMap[slot.origin]?.name || slot.origin;
            const destinationAirportName = airportDetailsMap[slot.destination]?.name || slot.destination;
            
            return (
              <tr key={slot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {airlineImages[index] && (
                      <Image 
                        src={airlineImages[index]!} 
                        alt="Airline" 
                        width={24}
                        height={24}
                        className="h-6 w-6 mr-3"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {slot.flightNumber || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {slot.aircraft || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {slot.origin} → {slot.destination}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {originAirportName} → {destinationAirportName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {slot.slotTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {slot.gate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!isBookable(slot) ? (
                    <SlotBookButton 
                      content={slot.owner?.vid || 'Booked'} 
                      canBookFlight={false}
                    />
                  ) : (
                    <SlotBookButton 
                      content="Book Flight" 
                      onClick={() => handleSlotScheduling(slot.id)}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        {hasMoreFlights && (
          <tfoot>
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center">
                <button
                  onClick={onMoreFlightsRequested}
                  disabled={isFecthingMoreFlights}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFecthingMoreFlights ? 'Loading...' : 'Load More'}
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}