'use client';

import { useCallback } from 'react';

interface Translations {
  splash: {
    title: string;
    subtitle: string;
    explore: string;
  };
  beta: {
    title: string;
    message: string;
  };
  flights: {
    flightNumber: string;
    gate: string;
    bookFlight: string;
    loadMore: string;
    search: string;
    filter: {
      aircraft: string;
      origin: string;
      destination: string;
      flightNumber: string;
      departure: string;
      arrival: string;
      call: string;
      reset: string;
      clear: string;
      apply: string;
    };
  };
  myFlights: {
    title: string;
    subtitle: string;
  };
  info: {
    pilotBriefing: {
      title: string;
      description: string;
    };
  };
  generics: {
    see: string;
  };
  events: {
    found: string;
  };
}

const translations: Translations = {
  splash: {
    title: 'Experience the best that flight simulation has to offer!',
    subtitle: 'Manage your bookings on a modern, fast and intuitive way.',
    explore: 'Explore Flights!'
  },
  beta: {
    title: 'BETA SYSTEM',
    message: 'KRONOS is a recently launched system and is under constant development. We count on you to report any bugs you find. 🐛'
  },
  flights: {
    flightNumber: 'Flight Number',
    gate: 'Gate',
    bookFlight: 'Book Flight',
    loadMore: 'Load More',
    search: 'Search flights',
    filter: {
      aircraft: 'Aircraft',
      origin: 'Origin',
      destination: 'Destination',
      flightNumber: 'Flight Number',
      departure: 'Departure',
      arrival: 'Arrival',
      call: 'Filter',
      reset: 'Reset',
      clear: 'Clear',
      apply: 'Apply'
    }
  },
  myFlights: {
    title: 'My Flights',
    subtitle: 'Manage your booked flights and view important information'
  },
  info: {
    pilotBriefing: {
      title: 'Pilot Briefing',
      description: 'Download the pilot briefing document for this flight'
    }
  },
  generics: {
    see: 'View'
  },
  events: {
    found: 'Found {count} events'
  }
};

export const useText = () => {
  const t = useCallback((key: keyof Translations | string, params?: Record<string, unknown>) => {
    const keys = key.split('.');
    let value: unknown = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    let result = typeof value === 'string' ? value : key;
    
    // Handle parameter interpolation
    if (params && typeof result === 'string') {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    
    return result;
  }, []);

  return { t };
};
