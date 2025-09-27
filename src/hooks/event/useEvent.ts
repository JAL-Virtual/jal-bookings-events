import { useContext, useEffect, useState, useCallback } from "react";
import { Event } from "../../types/Event";

// Mock API client for now - replace with actual implementation
const mockApiClient = {
  getEvent: async (id: number): Promise<Event> => {
    // Mock implementation - replace with actual API call
    return {
      id: id.toString(),
      name: `Event ${id}`,
      subtitle: `Subtitle for Event ${id}`,
      description: `Description for Event ${id}`,
      departure: 'RJTT',
      arrival: 'RJAA',
      date: new Date().toISOString(),
      time: '12:00Z',
      picture: undefined,
      pilotBriefingUrl: undefined
    };
  }
};

export function useEvent(id: number) {
  const [data, setData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mockApiClient.getEvent(id);
      setData(result);
    } catch (err) {
      setError('Failed to fetch event');
      console.error('Error fetching event:', err);
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
