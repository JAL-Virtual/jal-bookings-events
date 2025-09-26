'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Mock analytics tracking hook - replace with your actual analytics implementation
const useAnalyticsTracking = () => {
  const initialize = () => {
    // Initialize your analytics service (Google Analytics, Mixpanel, etc.)
    console.log('Analytics initialized');
  };

  const pageview = (path: string) => {
    // Track page view
    console.log('Page view:', path);
    // Example: gtag('config', 'GA_TRACKING_ID', { page_path: path });
  };

  return { initialize, pageview };
};

interface AppTrackingProps {
  children: React.ReactNode;
}

export const AppTracking: React.FC<AppTrackingProps> = ({ children }) => {
  const { initialize, pageview } = useAnalyticsTracking();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    pageview(url);
  }, [pathname, searchParams, pageview]);

  return <>{children}</>;
};
