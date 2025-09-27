import { useState, useEffect, useCallback, useContext, MutableRefObject } from "react";
import { Event } from "../types/Event";
import { ConsentAnwsers, CookieConsentContext } from "../contexts/CookieConsentContext";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface UseEventResult {
  data: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEvent(id: string): UseEventResult {
  const [data, setData] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/events?id=${id}&t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.events && result.events.length > 0) {
        // Find the specific event by ID
        const event = result.events.find((e: Event) => e.id === id);
        setData(event || null);
      } else {
        setData(null);
      }
    } catch (err: unknown) {
      console.error('Error fetching event:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchEvent();
    } else {
      setLoading(false);
    }
  }, [id, fetchEvent]);

  return {
    data,
    loading,
    error,
    refetch: fetchEvent
  };
}

// Pagination interface (for future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Pagination<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// Infinite query result interface
interface UseEventsResult {
  data: Event[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  refetch: () => void;
}

export function useEvents(page = 1, perPage = 6): UseEventsResult {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [, setTotal] = useState(0);

  const fetchEvents = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/events?page=${pageNum}&perPage=${perPage}&t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.events) {
        setData(result.events);
        setCurrentPage(pageNum);
        
        // Calculate pagination info
        const totalEvents = result.total || result.events.length;
        const totalPagesCount = Math.ceil(totalEvents / perPage);
        setTotal(totalEvents);
        setTotalPages(totalPagesCount);
      } else {
        setData([]);
        setError('No events found');
      }
    } catch (err: unknown) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  const fetchNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      fetchEvents(currentPage + 1);
    }
  }, [currentPage, totalPages, fetchEvents]);

  const fetchPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      fetchEvents(currentPage - 1);
    }
  }, [currentPage, fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents(currentPage);
  }, [currentPage, fetchEvents]);

  useEffect(() => {
    fetchEvents(page);
  }, [page, fetchEvents]);

  return {
    data,
    loading,
    error,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    fetchNextPage,
    fetchPreviousPage,
    refetch
  };
}

// Analytics Tracking interface
interface AnalyticsTracking {
  initialize: () => void;
  pageview: (pagePath: string) => void;
  modalview: (name: string) => void;
  setDimension: <T>(dimension: T) => void;
}

// Environment variable helper (mock implementation)
const getAnalyticsTrackingId = (): string | null => {
  // In a real implementation, this would read from environment variables
  // For now, return null to use no-op tracking
  return process.env.NEXT_PUBLIC_ANALYTICS_TRACKING_ID || null;
};

export function useAnalyticsTracking(): AnalyticsTracking {
  const { cookieConsent } = useContext(CookieConsentContext);
  const trackingId = getAnalyticsTrackingId();

  if (cookieConsent !== ConsentAnwsers.ACCEPTED || !trackingId) {
    // Return no-op tracking when consent is not given or tracking ID is missing
    const noopTracking: AnalyticsTracking = {
      initialize: () => {
        console.log('Analytics tracking disabled - no consent or tracking ID');
      },
      pageview: (pagePath: string) => {
        console.log('Analytics pageview disabled:', pagePath);
      },
      modalview: (name: string) => {
        console.log('Analytics modalview disabled:', name);
      },
      setDimension: <T>(dimension: T) => {
        console.log('Analytics setDimension disabled:', dimension);
      }
    };

    return noopTracking;
  }

  // Return actual tracking implementation
  return {
    initialize: () => {
      // Initialize Google Analytics 4
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', trackingId, {
          page_title: document.title,
          page_location: window.location.href
        });
        console.log('Analytics initialized with tracking ID:', trackingId);
      } else {
        console.warn('Google Analytics not available - gtag not found');
      }
    },

    pageview: (pagePath: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', trackingId, {
          page_path: pagePath,
          page_title: document.title,
          page_location: window.location.origin + pagePath
        });
        console.log('Analytics pageview tracked:', pagePath);
      }
    },

    modalview: (name: string) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
          page_title: `Modal: ${name}`,
          page_location: window.location.origin + `/modal/${name}`
        });
        console.log('Analytics modalview tracked:', name);
      }
    },

    setDimension: <T>(dimension: T) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', trackingId, dimension);
        console.log('Analytics dimension set:', dimension);
      }
    }
  };
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideClickHandler(ref: MutableRefObject<HTMLElement | null>, onOutsideClick: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (!ref.current || !(event.target instanceof HTMLElement)) {
        return;
      }

      if (!ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }
    
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onOutsideClick]);
}

// Translations type for internationalization
interface Translations {
  [key: string]: string | Translations;
}

// Type utility for nested keys
type NestedKeyOf<ObjectType extends object> =
  {[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
  }[keyof ObjectType & (string | number)];

// Mock translation function (replace with actual i18n implementation)
const mockTranslation = (key: string, ...args: unknown[]): string => {
  // In a real implementation, this would use react-i18next or similar
  // For now, return the key as a fallback
  console.log('Translation requested:', key, args);
  return key;
};

export function useText() {
  // Mock useTranslation hook (replace with actual react-i18next implementation)
  const t = mockTranslation;

  return {
    t: (translationPath: NestedKeyOf<Translations> | Array<NestedKeyOf<Translations>>, ...args: unknown[]) => {
      const path = Array.isArray(translationPath) ? translationPath.join('.') : translationPath;
      return t(path, ...args);
    }
  };
}
