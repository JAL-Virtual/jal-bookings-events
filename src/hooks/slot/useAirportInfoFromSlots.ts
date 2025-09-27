import { IocContext } from "../../contexts/IocContext";
import { useContext, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Slot } from "../../types/Slot";

// Mock API client for now - replace with actual implementation
const mockApiClient = {
  getAirportDetails: async (icao: string): Promise<AirportDetails> => {
    // Mock implementation - replace with actual API call
    return {
      icao,
      name: `${icao} Airport`,
      city: "Unknown City",
      country: "Unknown Country"
    };
  }
};

export function useAirportInfoFromSlots(slots: Slot[]) {
    const [airportDetailsMap, setAirportDetailsMap] = useState<Record<string, AirportDetails>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uniqueAirportIcaoList = useMemo(() => {
        const airportMap: Record<string, boolean> = {};

        slots.forEach((slot) => {
            if (airportMap[slot.origin] && airportMap[slot.destination]) {
                return;
            }

            if (airportMap[slot.origin] === undefined && slot.origin) {
                airportMap[slot.origin] = true;
            }

            if (airportMap[slot.destination] === undefined && slot.destination) {
                airportMap[slot.destination] = true;
            }
        });

        return Object.keys(airportMap);
    }, [slots]);

    useEffect(() => {
        const fetchAirportDetails = async () => {
            if (uniqueAirportIcaoList.length === 0) return;

            setLoading(true);
            setError(null);

            try {
                const detailsMap: Record<string, AirportDetails> = {};
                
                await Promise.all(
                    uniqueAirportIcaoList.map(async (icao) => {
                        try {
                            const details = await mockApiClient.getAirportDetails(icao);
                            detailsMap[icao] = details;
                        } catch (err) {
                            console.warn(`Failed to fetch airport details for ${icao}:`, err);
                        }
                    })
                );

                setAirportDetailsMap(detailsMap);
            } catch (err) {
                setError('Failed to fetch airport details');
                console.error('Error fetching airport details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAirportDetails();
    }, [uniqueAirportIcaoList]);

    return {
        airportDetailsMap,
        loading,
        error
    };
}
