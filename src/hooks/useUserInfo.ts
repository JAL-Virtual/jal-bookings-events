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
          // No API key found - this is normal for users who haven't logged in yet
          setUserInfo(null);
          setError(null);
          return;
        }

        const apiClient = new APIClient(apiKey);
        const userData = await apiClient.getUserInfo();
        setUserInfo(userData);
      } catch (err) {
        console.error('Error fetching user info:', err);
        // Don't set error for 401 - this just means user needs to log in
        if (err instanceof Error && err.message.includes('401')) {
          setError(null);
          setUserInfo(null);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch user info');
        }
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
