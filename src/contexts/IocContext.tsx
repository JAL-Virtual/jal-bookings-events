"use client";

import { createContext, useContext, ReactNode } from 'react';
import { APIClient, getStoredApiKey } from '../app/api/client';
import { Event } from '../types/Event';
import { Slot } from '../types/Slot';
import { AirportDetails } from '../types/AirportDetails';

export interface ApiClient {
  getEvent: (id: number) => Promise<Event>;
  getEvents: (params: { page: number; perPage: number }) => Promise<{ page: number; perPage: number; total: number; data: Event[] }>;
  getEventSlots: (eventId: number, pagination: { page: number; perPage: number }, slotType?: string) => Promise<{ page: number; perPage: number; total: number; data: Slot[] }>;
  getUserSlots: (eventId: number, pagination: { page: number; perPage: number }, flightNumber?: string) => Promise<{ page: number; perPage: number; total: number; data: Slot[] }>;
  getSlotCountByType: (eventId: number) => Promise<Record<string, number>>;
  scheduleSlot: (slotId: number, slotData?: Record<string, unknown>) => Promise<{ success: boolean; message?: string }>;
  cancelSchedule: (slotId: number) => Promise<{ success: boolean; message?: string }>;
  confirmSchedule: (slotId: number) => Promise<{ success: boolean; message?: string }>;
  getAirlineLogo: (airlineIcao: string) => Promise<string>;
  getAirportDetails: (icao: string) => Promise<AirportDetails>;
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
  getEventSlots: async (eventId, pagination) => {
    return {
      page: pagination.page,
      perPage: pagination.perPage,
      total: 0,
      data: []
    };
  },
  getUserSlots: async (eventId, pagination) => {
    return {
      page: pagination.page,
      perPage: pagination.perPage,
      total: 0,
      data: []
    };
  },
  getSlotCountByType: async () => {
    return {
      departure: 0,
      landing: 0,
      departureLanding: 0
    };
  },
  scheduleSlot: async () => {
    return { success: true };
  },
  cancelSchedule: async () => {
    return { success: true };
  },
  confirmSchedule: async () => {
    return { success: true };
  },
  getAirlineLogo: async () => {
    return '';
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
  const apiKey = getStoredApiKey();
  const apiClient = apiKey ? new APIClient(apiKey) : mockApiClient;
  
  return (
    <IocContext.Provider value={{ apiClient }}>
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
