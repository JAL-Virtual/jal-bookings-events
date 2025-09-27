export interface Translations {
  [key: string]: string | Translations;
}

export interface FilterState {
  flightNumber?: string;
  aircraft?: string;
  origin?: string;
  destination?: string;
  gate?: string;
  timeRange?: {
    start: string;
    end: string;
  };
}
