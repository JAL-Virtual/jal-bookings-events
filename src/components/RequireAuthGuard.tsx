'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  vid?: string;
  // Add other user properties as needed
}

interface RequireAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

// Mock authentication check - replace with your actual auth logic
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your actual authentication check
    const checkAuth = async () => {
      try {
        // Check if user is authenticated (e.g., check localStorage, cookies, or API call)
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token with your API
          const response = await fetch('/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
};

export const RequireAuthGuard: React.FC<RequireAuthGuardProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
};
