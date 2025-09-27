import { useState, useEffect, useCallback } from "react";
import { Slot } from "../components/SlotsTable";
import { AirportDetails } from "../components/SlotsTable";

export function useAirportInfoFromSlots(slots: Slot[]) {
  const [airportDetails, setAirportDetails] = useState<Array<AirportDetails | null>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAirportInfo = useCallback(async () => {
    if (slots.length === 0) {
      setAirportDetails([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Get unique airport codes
      const airportCodes = Array.from(new Set([
        ...slots.map(slot => slot.origin),
        ...slots.map(slot => slot.destination)
      ]));

      const airportPromises = airportCodes.map(async (icao) => {
        try {
          const response = await fetch(`/api/airport-info?icao=${icao}&t=${Date.now()}`);
          
          if (response.ok) {
            const result = await response.json();
            return result.success ? result.airport : null;
          }
          return null;
        } catch {
          return null;
        }
      });

      const airportResults = await Promise.all(airportPromises);
      setAirportDetails(airportResults);
    } catch (err) {
      console.error('Error fetching airport info:', err);
      setAirportDetails(new Array(slots.length).fill(null));
    } finally {
      setIsLoading(false);
    }
  }, [slots]);

  useEffect(() => {
    fetchAirportInfo();
  }, [fetchAirportInfo]);

  return airportDetails.map((airport, index) => ({
    data: airport,
    isLoading: isLoading,
    error: null
  }));
}
