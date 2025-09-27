"use client";

import { useState, useCallback } from 'react';
import { Translations } from '../types/Translations';

const mockTranslations: Translations = {
  'events.found': 'Found {{count}} events',
  'events.title': 'Events',
  'events.subtitle': 'Browse available events',
  'flights.search': 'Search flights',
  'flights.bookFlight': 'Book Flight',
  'flights.loadMore': 'Load More',
  'flights.filter.call': 'Filter',
  'flights.filter.reset': 'Reset',
  'flights.error.unableToBook.title': 'Unable to Book',
  'flights.error.unableToBook.subtitle': 'There was an error booking your flight',
  'flights.error.noFlightsFound.title': 'No Flights Found',
  'flights.error.noFlightsFound.subtitle': 'No flights match your search criteria',
  'myFlights.title': 'My Flights',
  'myFlights.subtitle': 'Manage your booked flights',
  'myFlights.boardingPass.cancelFlight': 'Cancel Flight',
  'myFlights.boardingPass.confirmFlight': 'Confirm Flight',
  'myFlights.boardingPass.waitToConfirm': 'Wait to Confirm',
  'myFlights.boardingPass.cancelFlightConfirmation': 'Are you sure you want to cancel this flight?',
  'info.pilotBriefing.title': 'Pilot Briefing',
  'info.pilotBriefing.description': 'Download the pilot briefing document',
  'info.atcBriefing.title': 'ATC Briefing',
  'info.atcBriefing.description': 'Download the ATC briefing document',
  'info.sceneries.title': 'Sceneries',
  'info.sceneries.description': 'Required sceneries for this event',
  'info.sceneries.sims.msfs.description': 'Microsoft Flight Simulator',
  'info.sceneries.sims.xplane.description': 'X-Plane',
  'info.sceneries.sims.p3d.description': 'Prepar3D',
  'info.sceneries.sims.fsx.description': 'Flight Simulator X',
  'notification.scheduled.title': 'Flight Scheduled',
  'notification.scheduled.subtitle': 'Your flight has been successfully scheduled',
  'notification.booked.title': 'Flight Confirmed',
  'notification.booked.subtitle': 'Your flight has been confirmed',
  'notification.cancelled.title': 'Flight Cancelled',
  'notification.cancelled.subtitle': 'Your flight has been cancelled',
  'notification.scheduleConfirmation.title': 'Confirm Schedule',
  'notification.scheduleConfirmation.subtitle': 'Please confirm your flight details',
  'notification.scheduleConfirmation.alert': 'Please review your flight details before confirming',
  'notification.scheduleConfirmation.button': 'Confirm Flight',
  'errors.notFound.title': 'Page Not Found',
  'errors.notFound.subtitle': 'The page you are looking for does not exist',
  'errors.general.title': 'Something went wrong',
  'errors.general.subtitle': 'An unexpected error occurred',
  'generics.back': 'Back',
  'generics.backToBeginning': 'Back to Home',
  'generics.see': 'View'
};

export function useText() {
  const [translations] = useState<Translations>(mockTranslations);

  const t = useCallback((key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value === 'string') {
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }
      return value;
    }
    
    return key;
  }, [translations]);

  return { t };
}