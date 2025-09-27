"use client";

import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IocContext } from '../contexts/IocContext';

interface Booking {
  id: string;
  eventId: string;
  slotId?: string;
  pilotId: string;
  pilotName: string;
  pilotEmail: string;
  jalId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    eventName: string;
    description: string;
    banner: string;
    type: string;
    status: string;
    dateStart: string;
    dateEnd: string;
  };
}

interface BookingsResponse {
  success: boolean;
  bookings: Booking[];
  error?: string;
}

export function useUserBookings(pilotId?: string) {
  const { apiClient } = useContext(IocContext);

  const { data: bookingsData, isLoading, error } = useQuery<BookingsResponse, AxiosError>({
    queryKey: ['userBookings', pilotId],
    queryFn: async () => {
      if (!pilotId) {
        return { success: true, bookings: [] };
      }
      
      const response = await fetch(`/api/bookings?pilotId=${pilotId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
    enabled: !!pilotId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasBookings = bookingsData?.bookings && bookingsData.bookings.length > 0;
  const bookings = bookingsData?.bookings || [];

  return { 
    bookings, 
    hasBookings, 
    isLoading, 
    error 
  };
}
