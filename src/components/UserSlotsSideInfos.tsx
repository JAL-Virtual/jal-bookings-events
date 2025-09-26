'use client';

import React from 'react';
import { MapIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface UserSlotsSideInfosProps {
  pilotBriefing: string;
}

export const UserSlotsSideInfos: React.FC<UserSlotsSideInfosProps> = ({ pilotBriefing }) => {
  return (
    <aside className="px-6 pt-9 bg-white dark:bg-gray-900 h-full">
      <h2 className="text-lg font-bold text-blue-600 dark:text-white">My Flights</h2>
      <p className="text-md text-blue-500 dark:text-gray-300">Manage your booked flights</p>
      
      <div className="mt-12">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <MapIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Pilot Briefing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Download the latest pilot briefing document for this event. Contains important information about procedures, routes, and requirements.
              </p>
              <a
                href={pilotBriefing}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                View Briefing
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
