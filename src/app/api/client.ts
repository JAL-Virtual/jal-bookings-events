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
