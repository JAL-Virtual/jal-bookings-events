"use client";

import { useContext } from "react";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { ONE_DAY } from "../constants/appConstants";
import { IocContext } from "../contexts/IocContext";
import { Event } from "../types/Event";

export function useEventDetail(id: number) {
  const { apiClient } = useContext(IocContext);
  const EVENT_DETAIL_KEY = ["eventDetail", id];

  const eventData = useQuery<Event, AxiosError>({
    queryKey: EVENT_DETAIL_KEY,
    queryFn: async () => await apiClient.getEvent(id),
    staleTime: ONE_DAY
  });

  return eventData;
}