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
    error: {
      unableToBook: {
        title: string;
        subtitle: string;
      };
      noFlightsFound: {
        title: string;
        subtitle: string;
      };
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
    atcBriefing: {
      title: string;
      description: string;
    };
    sceneries: {
      title: string;
      description: string;
      sims: {
        msfs: {
          description: string;
        };
        xplane: {
          description: string;
        };
        p3d: {
          description: string;
        };
        fsx: {
          description: string;
        };
      };
    };
  };
  generics: {
    see: string;
    backToBeginning: string;
  };
  events: {
    found: string;
  };
  errors: {
    notFound: {
      title: string;
      subtitle: string;
    };
    generic: {
      title: string;
      subtitle: string;
    };
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
    },
    error: {
      unableToBook: {
        title: 'Unable to Book Flight',
        subtitle: 'There was an error booking your flight. Please try again.'
      },
      noFlightsFound: {
        title: 'No Flights Found',
        subtitle: 'No flights match your current filters. Try adjusting your search criteria.'
      }
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
    },
    atcBriefing: {
      title: 'ATC Briefing',
      description: 'Download the ATC briefing document for this flight'
    },
    sceneries: {
      title: 'Sceneries',
      description: 'Required sceneries for this event',
      sims: {
        msfs: {
          description: 'Microsoft Flight Simulator 2020'
        },
        xplane: {
          description: 'X-Plane 11/12'
        },
        p3d: {
          description: 'Prepar3D'
        },
        fsx: {
          description: 'Microsoft Flight Simulator X'
        }
      }
    }
  },
  generics: {
    see: 'View',
    backToBeginning: 'Back to Beginning'
  },
  events: {
    found: 'Found {count} events'
  },
  errors: {
    notFound: {
      title: 'Page Not Found',
      subtitle: 'The page you are looking for does not exist or has been moved.'
    },
    generic: {
      title: 'Something went wrong',
      subtitle: 'An unexpected error occurred. Please try again later.'
    },
    'slot_already_booked': 'This slot is already booked by another pilot.',
    'invalid_slot': 'The selected slot is not valid.',
    'event_not_active': 'This event is not currently active.',
    'pilot_not_authorized': 'You are not authorized to book this slot.'
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
