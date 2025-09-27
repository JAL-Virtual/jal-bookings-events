import { useContext, useEffect, useState } from "react";

// Mock API client for now - replace with actual implementation
const mockApiClient = {
  getSlotCountByType: async (eventId: number): Promise<{
    departure: number;
    landing: number;
    departureLanding: number;
  }> => {
    // Mock implementation - replace with actual API call
    return {
      departure: 0,
      landing: 0,
      departureLanding: 0
    };
  }
};

export function useSlotCountByType(eventId: number) {
    const [data, setData] = useState<{
        departure: number;
        landing: number;
        departureLanding: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSlotCount = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await mockApiClient.getSlotCountByType(eventId);
                setData(result);
            } catch (err) {
                setError('Failed to fetch slot count');
                console.error('Error fetching slot count:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlotCount();
    }, [eventId]);

    return {
        data,
        isLoading,
        error,
        refetch: async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await mockApiClient.getSlotCountByType(eventId);
                setData(result);
            } catch (err) {
                setError('Failed to refetch slot count');
            } finally {
                setIsLoading(false);
            }
        }
    };
}
