"use client";

import { AxiosError } from "axios";
import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ONE_DAY } from "../../constants/appConstants";
import { IocContext } from "../../contexts/IocContext";
import { Slot } from "../../types/Slot";
import { Pagination } from "../../types/ApiBase";
import { SlotTypeOptions } from "../../types/SlotFilter";
import { FilterState } from "../../types/Translations";

export function useEventSlots(
	eventId: number,
	slotType?: SlotTypeOptions | null,
	filterState?: Partial<FilterState>,
	page = 1,
	perPage = 25,
) {
	const { apiClient } = useContext(IocContext);

	const slots = useInfiniteQuery<Pagination<Slot>, AxiosError>({
		queryKey: ['slots', eventId, (slotType ?? ""), (filterState ?? {})],
		queryFn: async ({ pageParam = page }) => {
			return await apiClient.getEventSlots(eventId, { page: pageParam as number, perPage }, slotType || undefined);
		},
		initialPageParam: page,
		staleTime: ONE_DAY,
		getNextPageParam: (lastPage) => {
			return (lastPage.page * lastPage.perPage) >= lastPage.total ? undefined : lastPage.page + 1;
		},
		getPreviousPageParam: (firstPage) => {
			return firstPage.page === 0 ? undefined : firstPage.page - 1;
		}
	});

	return slots;
}
