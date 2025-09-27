import { useContext } from 'react';
import { AxiosError } from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ONE_DAY } from "../../constants/appConstants";
import { IocContext } from '../../contexts/IocContext';
import { Event } from "../../types/Event";
import { Pagination } from '../../types/ApiBase';

export const useEvents = (page = 1, perPage = 6) => {
	const { apiClient } = useContext(IocContext);

	const eventList = useInfiniteQuery<Pagination<Event>, AxiosError>({
		queryKey: ['events'],
		queryFn: async ({ pageParam = page }) => {
			return await apiClient.getEvents({ page: pageParam, perPage });
		},
		staleTime: ONE_DAY,
		getNextPageParam: (lastPage, _) => {
			return (lastPage.page * lastPage.perPage) >= lastPage.total ? undefined : lastPage.page + 1;
		},
		getPreviousPageParam: (firstPage, _) => {
			return firstPage.page === 0 ? undefined : firstPage.page - 1;
		}
	});

	return eventList;
};
