import { useState, useEffect, useCallback } from "react";
import { EventListEvent, EventListPage, EventListResult } from "../types/Event";

export function useEventList(): {
  pages: EventListPage[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
} {
  const [pages, setPages] = useState<EventListPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = useCallback(async (page: number, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setIsFetchingNextPage(true);
      } else {
        setIsLoading(true);
      }
      
      const response = await fetch(`/api/events?page=${page}&perPage=6&t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.events) {
        const newPage: EventListPage = {
          page: page,
          perPage: 6,
          data: result.events,
          total: result.total || 0
        };

        if (isLoadMore) {
          setPages(prev => [...prev, newPage]);
        } else {
          setPages([newPage]);
        }

        // Check if there are more pages
        const totalPages = Math.ceil((result.total || 0) / 6);
        setHasNextPage(page < totalPages);
        setCurrentPage(page);
      } else {
        if (!isLoadMore) {
          setPages([]);
        }
        setHasNextPage(false);
      }
    } catch (err: unknown) {
      console.error('Error fetching events:', err);
      if (!isLoadMore) {
        setPages([]);
      }
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, []);

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchEvents(currentPage + 1, true);
    }
  }, [hasNextPage, isFetchingNextPage, currentPage, fetchEvents]);

  useEffect(() => {
    fetchEvents(1, false);
  }, [fetchEvents]);

  return {
    pages,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  };
}
