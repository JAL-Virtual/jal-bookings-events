import { useState, useEffect, useCallback } from "react";
import { Slot } from "../components/SlotsTable";

export function useAirlineLogosFromSlots(slots: Slot[]) {
  const [logos, setLogos] = useState<Array<Blob | null>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogos = useCallback(async () => {
    if (slots.length === 0) {
      setLogos([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const logoPromises = slots.map(async (slot) => {
        if (!slot.flightNumber) return null;
        
        try {
          const airlineCode = slot.flightNumber.substring(0, 2);
          const response = await fetch(`/api/airline-logo?code=${airlineCode}&t=${Date.now()}`);
          
          if (response.ok) {
            return await response.blob();
          }
          return null;
        } catch {
          return null;
        }
      });

      const logoResults = await Promise.all(logoPromises);
      setLogos(logoResults);
    } catch (err) {
      console.error('Error fetching airline logos:', err);
      setLogos(new Array(slots.length).fill(null));
    } finally {
      setIsLoading(false);
    }
  }, [slots]);

  useEffect(() => {
    fetchLogos();
  }, [fetchLogos]);

  return logos.map((logo, index) => ({
    data: logo,
    isLoading: isLoading,
    error: null
  }));
}
