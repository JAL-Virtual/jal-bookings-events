import { createContext, useContext, ReactNode } from 'react';

export interface ApiClient {
  getEvent: (id: number) => Promise<any>;
  getEvents: (params: { page: number; perPage: number }) => Promise<any>;
  getEventSlots: (eventId: number, pagination: { page: number; perPage: number }, slotType?: string, filterState?: any) => Promise<any>;
  getUserSlots: (eventId: number, pagination: { page: number; perPage: number }, flightNumber?: string) => Promise<any>;
  getSlotCountByType: (eventId: number) => Promise<any>;
  scheduleSlot: (slotId: number, slotData?: any) => Promise<any>;
  cancelSchedule: (slotId: number) => Promise<any>;
  confirmSchedule: (slotId: number) => Promise<any>;
  getAirlineLogo: (airlineIcao: string) => Promise<any>;
  getAirportDetails: (icao: string) => Promise<any>;
}

const mockApiClient: ApiClient = {
  getEvent: async (id: number) => {
    // Mock implementation
    return {
      id: id.toString(),
      eventName: `Event ${id}`,
      description: `Description for Event ${id}`,
      departure: 'RJTT',
      arrival: 'RJAA',
      date: new Date().toISOString(),
      time: '12:00Z',
      banner: undefined,
      pilotBriefing: 'https://example.com/briefing.pdf',
      atcBriefing: 'https://example.com/atc-briefing.pdf',
      airports: [],
      has_ended: false,
      can_confirm_slots: true
    };
  },
  getEvents: async (params) => {
    return {
      page: params.page,
      perPage: params.perPage,
      total: 10,
      data: []
    };
  },
  getEventSlots: async (eventId, pagination, slotType, filterState) => {
    return {
      page: pagination.page,
      perPage: pagination.perPage,
      total: 0,
      data: []
    };
  },
  getUserSlots: async (eventId, pagination, flightNumber) => {
    return {
      page: pagination.page,
      perPage: pagination.perPage,
      total: 0,
      data: []
    };
  },
  getSlotCountByType: async (eventId) => {
    return {
      departure: 0,
      landing: 0,
      departureLanding: 0
    };
  },
  scheduleSlot: async (slotId, slotData) => {
    return { success: true };
  },
  cancelSchedule: async (slotId) => {
    return { success: true };
  },
  confirmSchedule: async (slotId) => {
    return { success: true };
  },
  getAirlineLogo: async (airlineIcao) => {
    return null;
  },
  getAirportDetails: async (icao) => {
    return {
      icao,
      iata: 'NRT',
      name: 'Narita International Airport',
      city: 'Tokyo',
      country: 'Japan'
    };
  }
};

interface IocContextType {
  apiClient: ApiClient;
}

const IocContext = createContext<IocContextType>({
  apiClient: mockApiClient
});

interface IocProviderProps {
  children: ReactNode;
}

export function IocProvider({ children }: IocProviderProps) {
  return (
    <IocContext.Provider value={{ apiClient: mockApiClient }}>
      {children}
    </IocContext.Provider>
  );
}

export function useIocContext() {
  const context = useContext(IocContext);
  if (!context) {
    throw new Error('useIocContext must be used within an IocProvider');
  }
  return context;
}

export { IocContext };
