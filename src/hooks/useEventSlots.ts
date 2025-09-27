import { useState, useEffect, useCallback } from "react";
import { Slot } from "../types/Slot";

export function useEventSlots(eventId: number, selectedSlotType: string | null, appliedFilters: Record<string, unknown>) {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSlots = useCallback(async (page: number, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsFetchingNextPage(true);
      } else {
        setIsLoading(true);
      }
      
      const params = new URLSearchParams({
        eventId: eventId.toString(),
        page: page.toString(),
        perPage: '20'
      });

      if (selectedSlotType) {
        params.append('type', selectedSlotType);
      }

      if (appliedFilters.flightNumber) {
        params.append('flightNumber', appliedFilters.flightNumber as string);
      }

      const response = await fetch(`/api/slots?${params.toString()}&t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.slots) {
        const newPage = {
          page: page,
          data: result.slots,
          total: result.total || 0
        };

        if (isLoadMore) {
          setPages(prev => [...prev, newPage]);
        } else {
          setPages([newPage]);
        }

        const totalPages = Math.ceil((result.total || 0) / 20);
        setHasNextPage(page < totalPages);
        setCurrentPage(page);
      } else {
        if (!isLoadMore) {
          setPages([]);
        }
        setHasNextPage(false);
      }
    } catch (err: unknown) {
      console.error('Error fetching slots:', err);
      if (!isLoadMore) {
        setPages([]);
      }
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [eventId, selectedSlotType, appliedFilters]);

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchSlots(currentPage + 1, true);
    }
  }, [hasNextPage, isFetchingNextPage, currentPage, fetchSlots]);

  useEffect(() => {
    fetchSlots(1, false);
  }, [fetchSlots]);

  return {
    data: pages,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  };
}
