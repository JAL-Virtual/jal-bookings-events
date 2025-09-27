"use client";

import { AxiosError } from "axios";
import { useContext } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ONE_DAY } from "../../constants/appConstants";
import { IocContext } from "../../contexts/IocContext";
import { Slot } from "../../types/Slot";
import { Pagination } from "../../types/ApiBase";

export function useEventUserSlots(eventId: number, flightNumber?: string | null, page = 1, perPage = 25) {
	const { apiClient } = useContext(IocContext);

	const slots = useInfiniteQuery<Pagination<Slot>, AxiosError>({
		queryKey: ['eventUserSlots', eventId, (flightNumber ?? "")],
		queryFn: async ({ pageParam = page }) => {
			return await apiClient.getUserSlots(eventId, { page: pageParam as number, perPage }, flightNumber || undefined);
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
