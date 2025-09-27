import { useState, useEffect, useCallback } from "react";
import { Slot } from "../components/SlotsTable";

export enum SlotBookActions {
  BOOK = "book",
  CONFIRM = "confirm", 
  CANCEL = "cancel"
}

interface SlotBookParams {
  slotId: number;
  eventId: number;
  slotData?: {
    flightNumber: string;
    aircraft: string;
    origin: string;
    destination: string;
  };
}

interface UseSlotBookMutationResult {
  mutate: (params: SlotBookParams) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: any;
  variables?: SlotBookParams;
}

export function useSlotBookMutation(action: SlotBookActions): UseSlotBookMutationResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);
  const [variables, setVariables] = useState<SlotBookParams | undefined>();

  const mutate = useCallback(async (params: SlotBookParams) => {
    try {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);
      setVariables(params);

      const endpoint = action === SlotBookActions.BOOK 
        ? '/api/slots/book'
        : action === SlotBookActions.CONFIRM
        ? '/api/slots/confirm'
        : '/api/slots/cancel';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: params.slotId,
          eventId: params.eventId,
          ...(params.slotData && { slotData: params.slotData })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to perform slot action');
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [action]);

  return {
    mutate,
    isLoading,
    isSuccess,
    isError,
    error,
    variables
  };
}
