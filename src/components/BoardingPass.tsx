import { ReactNode } from 'react';

export enum BoardingPassType {
  DEPARTURE = 'departure',
  ARRIVAL = 'arrival'
}

interface BoardingPassProps {
  user: {
    firstName: string;
    lastName: string;
    vid: string;
  };
  origin: {
    name: string;
    iata: string;
  };
  destination: {
    name: string;
    iata: string;
  };
  callsign: string;
  slotDate: string;
  gate: string;
  type: BoardingPassType;
  eventStartDate: Date;
  actions?: ReactNode;
}

export function BoardingPass({
  user,
  origin,
  destination,
  callsign,
  slotDate,
  gate,
  type,
  eventStartDate,
  actions
}: BoardingPassProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            VID: {user.vid}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {callsign}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {type === BoardingPassType.DEPARTURE ? 'Departure' : 'Arrival'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">From</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {origin.iata}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {origin.name}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">To</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {destination.iata}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {destination.name}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Time</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {slotDate}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Gate</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {gate}
          </p>
        </div>
      </div>
      
      {actions && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {actions}
        </div>
      )}
    </div>
  );
}