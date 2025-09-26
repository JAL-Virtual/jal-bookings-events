'use client';

import React from 'react';
import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  UserGroupIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

export type EmptyStateType = 'no-data' | 'no-results' | 'no-events' | 'no-bookings' | 'error' | 'no-slots' | 'no-staff';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-data',
  title,
  description,
  icon,
  action,
  className = ''
}) => {
  const getDefaultConfig = (type: EmptyStateType) => {
    switch (type) {
      case 'no-results':
        return {
          title: 'No results found',
          description: 'Try adjusting your search criteria or filters to find what you\'re looking for.',
          icon: <MagnifyingGlassIcon className="h-16 w-16 text-gray-400" />,
        };
      case 'no-events':
        return {
          title: 'No events available',
          description: 'There are currently no aviation events scheduled. Check back later for updates.',
          icon: <CalendarDaysIcon className="h-16 w-16 text-gray-400" />,
        };
      case 'no-bookings':
        return {
          title: 'No bookings yet',
          description: 'You haven\'t made any bookings yet. Browse available events to get started.',
          icon: <DocumentTextIcon className="h-16 w-16 text-gray-400" />,
        };
      case 'no-slots':
        return {
          title: 'No slots available',
          description: 'All slots for this event have been booked. Try selecting a different time slot.',
          icon: <PaperAirplaneIcon className="h-16 w-16 text-gray-400" />,
        };
      case 'no-staff':
        return {
          title: 'No staff members',
          description: 'No staff members have been added to this event yet.',
          icon: <UserGroupIcon className="h-16 w-16 text-gray-400" />,
        };
      case 'error':
        return {
          title: 'Something went wrong',
          description: 'We encountered an error while loading the data. Please try again later.',
          icon: <ExclamationTriangleIcon className="h-16 w-16 text-red-400" />,
        };
      default: // no-data
        return {
          title: 'No data available',
          description: 'There\'s no data to display at the moment.',
          icon: <DocumentTextIcon className="h-16 w-16 text-gray-400" />,
        };
    }
  };

  const config = getDefaultConfig(type);
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayIcon = icon || config.icon;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4">
        {displayIcon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {displayTitle}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
        {displayDescription}
      </p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          {action.label}
        </button>
      )}
    </div>
  );
};

// Convenience components for common empty states
export const NoResultsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-results" {...props} />
);

export const NoEventsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-events" {...props} />
);

export const NoBookingsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-bookings" {...props} />
);

export const NoSlotsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="no-slots" {...props} />
);

export const ErrorEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState type="error" {...props} />
);

// Aviation-specific empty states
export const NoFlightsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState 
    type="no-data"
    title="No flights scheduled"
    description="There are no flights scheduled for the selected date and route."
    icon={<PaperAirplaneIcon className="h-16 w-16 text-gray-400" />}
    {...props}
  />
);

export const NoPilotsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState 
    type="no-data"
    title="No pilots available"
    description="No pilots have registered for this event yet."
    icon={<UserGroupIcon className="h-16 w-16 text-gray-400" />}
    {...props}
  />
);
