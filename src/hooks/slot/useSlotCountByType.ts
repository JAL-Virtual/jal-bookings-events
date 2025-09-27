import { useContext } from "react";
import { IocContext } from "../../contexts/IocContext";
import { useQuery } from "@tanstack/react-query";
import { ONE_DAY } from "../../constants/appConstants";

export function useSlotCountByType(eventId: number) {
    const { apiClient } = useContext(IocContext);

    const slotCount = useQuery({
        queryKey: ['slotCount', eventId],
        queryFn: async () => await apiClient.getSlotCountByType(eventId),
        staleTime: ONE_DAY * 5
    });

    return slotCount;
}
