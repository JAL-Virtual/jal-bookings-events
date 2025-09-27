"use client";

import { AxiosError } from "axios";
import { IocContext } from "../../contexts/IocContext";
import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse } from "../../types/ApiBase";
import { SlotScheduleData, SlotBookActions } from "../../types/Slot";

interface SlotBookMutationVariables {
    slotId: number;
    eventId: number;
    slotData?: SlotScheduleData;
}

export function useSlotBookMutation(action: SlotBookActions) {
    const { apiClient } = useContext(IocContext);
    const queryClient = useQueryClient();

    const bookingMutation = useMutation<{ success: boolean; message?: string }, AxiosError<ApiErrorResponse>, SlotBookMutationVariables>({
        mutationFn: ({ slotId, slotData }) => {
            switch (action) {
                case SlotBookActions.BOOK:
                    return apiClient.scheduleSlot(slotId, slotData);
                case SlotBookActions.CANCEL:
                    return apiClient.cancelSchedule(slotId);
                case SlotBookActions.CONFIRM:
                    return apiClient.confirmSchedule(slotId);
                default:
                    return Promise.reject("Invalid slot action: " + String(action));
            }
        },
        onSuccess: async (_, { eventId }) => {
            await queryClient.invalidateQueries({ queryKey: ['slots', eventId] });
            await queryClient.invalidateQueries({ queryKey: ['eventUserSlots', eventId] });
        }
    });

    return bookingMutation;
}
