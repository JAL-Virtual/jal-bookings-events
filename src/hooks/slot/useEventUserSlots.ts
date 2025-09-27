import { useContext, useEffect, useState, useCallback } from "react";
import { Slot } from "../../types/Slot";
import { Pagination } from "../../types/Pagination";

// Mock API client for now - replace with actual implementation
const mockApiClient = {
  getUserSlots: async (
    eventId: number, 
    pagination: { page: number; perPage: number }, 
    flightNumber?: string | null
  ): Promise<Pagination<Slot>> => {
    // Mock implementation - replace with actual API call
    return {
      data: [],
      page: pagination.page,
      perPage: pagination.perPage,
      total: 0,
      totalPages: 0
    };
  }
};

export function useEventUserSlots(eventId: number, flightNumber?: string | null, page = 1, perPage = 25) {
	const [data, setData] = useState<Pagination<Slot>[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

	const fetchUserSlots = useCallback(async (pageParam = page) => {
		try {
			const result = await mockApiClient.getUserSlots(eventId, { page: pageParam, perPage }, flightNumber);
			return result;
		} catch (err) {
			console.error('Error fetching user slots:', err);
			throw err;
		}
	}, [eventId, perPage, flightNumber, page]);

	const fetchNextPage = useCallback(async () => {
		if (isFetchingNextPage || !hasNextPage) return;

		setIsFetchingNextPage(true);
		try {
			const nextPage = data.length + 1;
			const result = await fetchUserSlots(nextPage);
			
			setData(prev => [...prev, result]);
			setHasNextPage((result.page * result.perPage) < result.total);
		} catch (err) {
			setError('Failed to fetch next page');
		} finally {
			setIsFetchingNextPage(false);
		}
	}, [data.length, fetchUserSlots, hasNextPage, isFetchingNextPage]);

	useEffect(() => {
		const loadInitialData = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				const result = await fetchUserSlots(page);
				setData([result]);
				setHasNextPage((result.page * result.perPage) < result.total);
			} catch (err) {
				setError('Failed to fetch user slots');
			} finally {
				setIsLoading(false);
			}
		};

		loadInitialData();
	}, [fetchUserSlots, page]);

	return {
		data: { pages: data },
		isLoading,
		error,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		refetch: () => {
			setData([]);
			setIsLoading(true);
			setError(null);
			fetchUserSlots(page).then(result => {
				setData([result]);
				setHasNextPage((result.page * result.perPage) < result.total);
				setIsLoading(false);
			}).catch(err => {
				setError('Failed to refetch user slots');
				setIsLoading(false);
			});
		}
	};
}
