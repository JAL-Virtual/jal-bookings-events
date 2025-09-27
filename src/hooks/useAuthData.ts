import { useState, useEffect, useCallback } from "react";

interface User {
  firstName: string;
  lastName: string;
  vid: string;
}

interface UseAuthDataResult {
  data: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuthData(): UseAuthDataResult {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user', {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.user) {
        setData(result.user);
      } else {
        setData(null);
      }
    } catch (err: unknown) {
      console.error('Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    data,
    isLoading,
    error
  };
}
