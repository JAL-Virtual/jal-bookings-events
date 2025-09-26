'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  // Add other event properties as needed
}

interface ActiveEventGuardProps {
  eventId?: string;
  children: React.ReactNode;
}

// Mock hook for event data - replace with your actual event fetching logic
const useEvent = (eventId: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    // Replace this with your actual API call
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data.event);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { data: event, loading };
};

export const ActiveEventGuard: React.FC<ActiveEventGuardProps> = ({ 
  eventId, 
  children 
}) => {
  const router = useRouter();
  const { data: event, loading } = useEvent(eventId);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!event) {
      router.push('/404');
      return;
    }

    // Status that allows viewing the event
    if (event.status === 'scheduled' || event.status === 'active') {
      return;
    }

    // Redirect to 404 for inactive events
    router.push('/404');
  }, [router, event, loading]);

  // Show loading state while checking event
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render children if event is not accessible
  if (!event || (event.status !== 'scheduled' && event.status !== 'active')) {
    return null;
  }

  return <>{children}</>;
};
