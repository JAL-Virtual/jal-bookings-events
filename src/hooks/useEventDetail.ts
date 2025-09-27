import { useState, useEffect, useCallback } from "react";
import { EventDetailEvent } from "../types/Scenary";

interface UseEventDetailResult {
  data: EventDetailEvent | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEventDetail(id: number): UseEventDetailResult {
  const [data, setData] = useState<EventDetailEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/events/${id}?t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.event) {
        setData(result.event);
      } else {
        setData(null);
      }
    } catch (err: unknown) {
      console.error('Error fetching event detail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchEvent
  };
}
