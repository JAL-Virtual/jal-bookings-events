export function useEvent(id: number) {
  const { apiClient } = useContext(IocContext);
  const EVENT_DETAIL_KEY = ["event", id];

  const eventData = useQuery<Event, AxiosError>({
    queryKey: EVENT_DETAIL_KEY,
    queryFn: async () => await apiClient.getEvent(id),
    staleTime: ONE_DAY
  });

  return eventData;
}
