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
  }
};

export const useText = () => {
  const t = useCallback((key: keyof Translations | string) => {
    const keys = key.split('.');
    let value: unknown = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }, []);

  return { t };
};
