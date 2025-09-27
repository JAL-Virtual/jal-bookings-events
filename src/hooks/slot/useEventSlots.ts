import { useContext, useEffect, useState, useCallback } from "react";
import { Slot } from "../../types/Slot";
import { Pagination } from "../../types/Pagination";
import { SlotTypeOptions } from "../../types/SlotFilter";
import { FilterState } from "../../components/Filter";

// Mock API client for now - replace with actual implementation
const mockApiClient = {
  getEventSlots: async (
    eventId: number, 
    pagination: { page: number; perPage: number }, 
    slotType?: SlotTypeOptions | null,
    filterState?: Partial<FilterState>
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

export function useEventSlots(
	eventId: number,
	slotType?: SlotTypeOptions | null,
	filterState?: Partial<FilterState>,
	page = 1,
	perPage = 25,
) {
	const [data, setData] = useState<Pagination<Slot>[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

	const fetchSlots = useCallback(async (pageParam = page) => {
		try {
			const result = await mockApiClient.getEventSlots(eventId, { page: pageParam, perPage }, slotType, filterState);
			return result;
		} catch (err) {
			console.error('Error fetching slots:', err);
			throw err;
		}
	}, [eventId, perPage, slotType, filterState, page]);

	const fetchNextPage = useCallback(async () => {
		if (isFetchingNextPage || !hasNextPage) return;

		setIsFetchingNextPage(true);
		try {
			const nextPage = data.length + 1;
			const result = await fetchSlots(nextPage);
			
			setData(prev => [...prev, result]);
			setHasNextPage((result.page * result.perPage) < result.total);
		} catch (err) {
			setError('Failed to fetch next page');
		} finally {
			setIsFetchingNextPage(false);
		}
	}, [data.length, fetchSlots, hasNextPage, isFetchingNextPage]);

	useEffect(() => {
		const loadInitialData = async () => {
			setIsLoading(true);
			setError(null);
			
			try {
				const result = await fetchSlots(page);
				setData([result]);
				setHasNextPage((result.page * result.perPage) < result.total);
			} catch (err) {
				setError('Failed to fetch slots');
			} finally {
				setIsLoading(false);
			}
		};

		loadInitialData();
	}, [fetchSlots, page]);

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
			fetchSlots(page).then(result => {
				setData([result]);
				setHasNextPage((result.page * result.perPage) < result.total);
				setIsLoading(false);
			}).catch(err => {
				setError('Failed to refetch slots');
				setIsLoading(false);
			});
		}
	};
}
