import { useState, useEffect } from 'react';

export interface StaffKey {
  id: string;
  key: string;
  createdAt: string;
  isActive: boolean;
}

export const useStaffKeys = () => {
  const [staffKeys, setStaffKeys] = useState<StaffKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff keys from MongoDB
  const fetchStaffKeys = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/staff-keys');
      const data = await response.json();
      
      if (data.success) {
        setStaffKeys(data.staffKeys);
      } else {
        setError(data.error || 'Failed to fetch staff keys');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching staff keys:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new staff key
  const addStaffKey = async (key: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/staff-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the staff keys list
        await fetchStaffKeys();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error adding staff key:', err);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Remove staff key
  const removeStaffKey = async (key: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`/api/staff-keys?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh the staff keys list
        await fetchStaffKeys();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error removing staff key:', err);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Load staff keys on component mount
  useEffect(() => {
    fetchStaffKeys();
  }, []);

  return {
    staffKeys,
    isLoading,
    error,
    addStaffKey,
    removeStaffKey,
    refreshStaffKeys: fetchStaffKeys,
  };
};
