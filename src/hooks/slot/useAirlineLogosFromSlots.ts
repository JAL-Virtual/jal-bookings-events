import { useContext, useEffect, useState } from "react";
import { Slot } from "../../types/Slot";

// Mock API client for now - replace with actual implementation
const mockApiClient = {
  getAirlineLogo: async (airlineIcao: string): Promise<Blob | null> => {
    // Mock implementation - replace with actual API call
    // For now, return null to indicate no logo available
    return null;
  }
};

// Helper function to extract airline ICAO from slot
function getSlotAirline(slot: Slot): string {
  if (!slot.flightNumber) return '';
  
  // Extract airline code from flight number (first 2-3 characters)
  const match = slot.flightNumber.match(/^([A-Z]{2,3})/);
  return match ? match[1] : '';
}

export function useAirlineLogosFromSlots(slots: Slot[]) {
    const [airlineImages, setAirlineImages] = useState<Array<Blob | null>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAirlineLogos = async () => {
            if (slots.length === 0) return;

            setLoading(true);
            setError(null);

            try {
                const logoPromises = slots.map(async (slot) => {
                    if (!slot.flightNumber) {
                        return null;
                    }

                    const airlineIcao = getSlotAirline(slot);
                    if (!airlineIcao) {
                        return null;
                    }

                    try {
                        return await mockApiClient.getAirlineLogo(airlineIcao);
                    } catch (err) {
                        console.warn(`Failed to fetch airline logo for ${airlineIcao}:`, err);
                        return null;
                    }
                });

                const logos = await Promise.all(logoPromises);
                setAirlineImages(logos);
            } catch (err) {
                setError('Failed to fetch airline logos');
                console.error('Error fetching airline logos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAirlineLogos();
    }, [slots]);

    return {
        airlineImages,
        loading,
        error
    };
}
