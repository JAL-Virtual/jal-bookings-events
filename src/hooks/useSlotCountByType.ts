import { useState, useEffect, useCallback } from "react";

interface SlotCountByType {
  departure?: number;
  landing?: number;
  departureLanding?: number;
}

export function useSlotCountByType(eventId: number) {
  const [data, setData] = useState<SlotCountByType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlotCount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/slots/count?eventId=${eventId}&t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setData(result.counts || {});
      } else {
        setData({});
      }
    } catch (err: unknown) {
      console.error('Error fetching slot count:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch slot count');
      setData({});
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchSlotCount();
  }, [fetchSlotCount]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSlotCount
  };
}
