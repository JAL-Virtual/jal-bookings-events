"use client";

import { useState, useEffect } from 'react';
import { APIClient, JALUserResponse, getStoredApiKey } from '../app/api/client';

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<JALUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiKey = getStoredApiKey();
        if (!apiKey) {
          setError('No API key found');
          return;
        }

        const apiClient = new APIClient(apiKey);
        const userData = await apiClient.getUserInfo();
        setUserInfo(userData);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user info');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return {
    userInfo,
    isLoading,
    error
  };
}
