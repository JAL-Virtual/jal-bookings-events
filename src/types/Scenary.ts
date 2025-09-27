export interface EventDetailEvent {
  id: number;
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  has_ended: boolean;
  can_confirm_slots: boolean;
  pilotBriefing: string;
  banner?: string;
  type: string;
}

export interface Scenary {
  id: number;
  name: string;
  description: string;
  simulators: ScenarySimulators[];
}

export interface ScenarySimulators {
  id: number;
  name: string;
  description: string;
  capacity: number;
}