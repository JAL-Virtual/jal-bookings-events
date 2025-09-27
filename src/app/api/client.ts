// API Client Service - Uses internal API routes
export interface JALUserResponse {
  id: number;
  username: string;
  email: string;
  callsign: string;
  status: string;
  // Add other user fields as needed
}

export interface JALApiResponse {
  name: string;
  version: string;
  php: string;
}

export class APIClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async validateApiKey(): Promise<JALUserResponse> {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey: this.apiKey })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async getUserInfo(): Promise<JALUserResponse> {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status}`);
    }

    return await response.json();
  }

  async getEvents(): Promise<{ success: boolean; events: Array<{
    id: string;
    name: string;
    description: string | null;
    departure: string | null;
    arrival: string | null;
    date: Date;
    time: string | null;
    picture: string | null;
    route: string | null;
    airline: string | null;
    flightNumber: string | null;
    aircraft: string | null;
    origin: string | null;
    destination: string | null;
    eobtEta: string | null;
    stand: string | null;
    maxPilots: number;
    currentBookings: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    bookings: Array<unknown>;
  }> }> {
    const response = await fetch('/api/events', {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    return await response.json();
  }

  async submitBooking(bookingData: {
    eventId: string;
    pilotName: string;
    callsign: string;
    aircraft: string;
    slotId?: string;
  }): Promise<{ success: boolean; booking?: unknown; error?: string }> {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit booking: ${response.status}`);
    }

    return await response.json();
  }

  // Additional methods expected by hooks
  async getEvent(id: number): Promise<any> {
    const response = await fetch(`/api/events/${id}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.status}`);
    }

    return await response.json();
  }

  async getEvents(params?: { page?: number; perPage?: number }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.perPage) searchParams.append('perPage', params.perPage.toString());
    
    const response = await fetch(`/api/events?${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const result = await response.json();
    
    // Transform the API response to match Pagination<Event> format
    if (result.success && result.events) {
      return {
        page: params?.page || 1,
        perPage: params?.perPage || 6,
        total: result.events.length,
        data: result.events.map((event: any) => ({
          id: event.id,
          eventName: event.name,
          description: event.description || '',
          departure: event.departure,
          arrival: event.arrival,
          date: event.date,
          time: event.time,
          banner: event.picture,
          type: 'takeoff_landing', // Default type
          status: event.status,
          dateStart: event.date,
          dateEnd: event.date,
          pilotBriefing: '',
          atcBriefing: '',
          airports: [],
          has_ended: event.status === 'CANCELLED',
          can_confirm_slots: event.status === 'ACTIVE'
        }))
      };
    }
    
    return {
      page: params?.page || 1,
      perPage: params?.perPage || 6,
      total: 0,
      data: []
    };
  }

  async getEventSlots(eventId: number, params?: { page?: number; perPage?: number }, slotType?: string, filterState?: any): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.perPage) searchParams.append('perPage', params.perPage.toString());
    if (slotType) searchParams.append('slotType', slotType);
    
    const response = await fetch(`/api/slots?eventId=${eventId}&${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch slots: ${response.status}`);
    }

    return await response.json();
  }

  async getUserSlots(eventId: number, params?: { page?: number; perPage?: number }, flightNumber?: string): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.perPage) searchParams.append('perPage', params.perPage.toString());
    if (flightNumber) searchParams.append('flightNumber', flightNumber);
    
    const response = await fetch(`/api/user/slots?eventId=${eventId}&${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user slots: ${response.status}`);
    }

    return await response.json();
  }

  async scheduleSlot(slotId: number, slotData?: any): Promise<any> {
    const response = await fetch(`/api/slots/${slotId}/schedule`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(slotData)
    });

    if (!response.ok) {
      throw new Error(`Failed to schedule slot: ${response.status}`);
    }

    return await response.json();
  }

  async cancelSchedule(slotId: number): Promise<any> {
    const response = await fetch(`/api/slots/${slotId}/cancel`, {
      method: 'POST',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel schedule: ${response.status}`);
    }

    return await response.json();
  }

  async confirmSchedule(slotId: number): Promise<any> {
    const response = await fetch(`/api/slots/${slotId}/confirm`, {
      method: 'POST',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to confirm schedule: ${response.status}`);
    }

    return await response.json();
  }

  async getSlotCountByType(eventId: number): Promise<any> {
    const response = await fetch(`/api/slots/count?eventId=${eventId}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch slot count: ${response.status}`);
    }

    return await response.json();
  }

  async getAirlineLogo(airlineIcao: string): Promise<string> {
    const response = await fetch(`/api/airline/logo?icao=${airlineIcao}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch airline logo: ${response.status}`);
    }

    return await response.text();
  }

  async getAirportDetails(icao: string): Promise<any> {
    const response = await fetch(`/api/airport/details?icao=${icao}`, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch airport details: ${response.status}`);
    }

    return await response.json();
  }
}

// Utility functions
export const getStoredApiKey = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jal_api_key');
  }
  return null;
};

export const clearStoredApiKey = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jal_api_key');
  }
};

export const isAuthenticated = (): boolean => {
  return getStoredApiKey() !== null;
};
