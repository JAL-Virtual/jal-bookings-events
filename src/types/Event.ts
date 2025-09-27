export interface Event {
  id: string;
  eventName: string;
  subtitle?: string;
  description: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  picture?: string;
  pilotBriefingUrl?: string;
  banner?: string;
  type: string;
  status: string;
  dateStart: string;
  dateEnd: string;
  pilotBriefing: string;
  atcBriefing: string;
  airports: {
    icao: string;
    sceneries: Scenary[];
  }[];
  has_ended: boolean;
  can_confirm_slots: boolean;
}

export interface Scenary {
  id: string;
  title: string;
  link: string;
  simulator: ScenarySimulators;
  license: 'freeware' | 'payware';
}

export enum ScenarySimulators {
  MSFS = "msfs",
  XPLANE = "xplane",
  P3D = "p3d",
  FSX = "fsx"
}

export function getEventTypeName(type: string): string {
  const typeMap: Record<string, string> = {
    'takeoff': 'Takeoff Event',
    'landing': 'Landing Event',
    'takeoff_landing': 'Takeoff & Landing Event'
  };
  return typeMap[type] || type;
}