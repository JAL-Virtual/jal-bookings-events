"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../app/api/client';

interface RequireAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const RequireAuthGuard: React.FC<RequireAuthGuardProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated using the API key
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push(redirectTo);
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [router, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};