import { useState, useEffect, useCallback } from "react";
import { Slot } from "../components/SlotsTable";

export enum BookingStatus {
  BOOKED = "booked",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled"
}

interface UserSlot extends Slot {
  bookingStatus: BookingStatus;
}

interface UserSlotPage {
  page: number;
  data: UserSlot[];
  total: number;
}

export function useEventUserSlots(eventId: number, searchedFlightNumber?: string | null) {
  const [pages, setPages] = useState<UserSlotPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUserSlots = useCallback(async (page: number, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsFetchingNextPage(true);
      } else {
        setIsLoading(true);
      }
      
      const params = new URLSearchParams({
        eventId: eventId.toString(),
        page: page.toString(),
        perPage: '10'
      });

      if (searchedFlightNumber) {
        params.append('flightNumber', searchedFlightNumber);
      }

      const response = await fetch(`/api/user-slots?${params.toString()}&t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.slots) {
        const newPage: UserSlotPage = {
          page: page,
          data: result.slots,
          total: result.total || 0
        };

        if (isLoadMore) {
          setPages(prev => [...prev, newPage]);
        } else {
          setPages([newPage]);
        }

        const totalPages = Math.ceil((result.total || 0) / 10);
        setHasNextPage(page < totalPages);
        setCurrentPage(page);
      } else {
        if (!isLoadMore) {
          setPages([]);
        }
        setHasNextPage(false);
      }
    } catch (err: unknown) {
      console.error('Error fetching user slots:', err);
      if (!isLoadMore) {
        setPages([]);
      }
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [eventId, searchedFlightNumber]);

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchUserSlots(currentPage + 1, true);
    }
  }, [hasNextPage, isFetchingNextPage, currentPage, fetchUserSlots]);

  useEffect(() => {
    fetchUserSlots(1, false);
  }, [fetchUserSlots]);

  return {
    data: pages,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  };
}
