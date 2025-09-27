import { useState, useEffect } from 'react';

export function useAuthData() {
  const [data, setData] = useState<{
    firstName: string;
    lastName: string;
    vid: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock implementation - replace with actual auth logic
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      vid: 'JAL001'
    };
    
    setData(mockUser);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error
  };
}