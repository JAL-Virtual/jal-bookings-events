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

export interface ScenaryDetail {
  id: number;
  name: string;
  description: string;
  simulators: ScenarySimulatorsDetail[];
}

export interface ScenarySimulatorsDetail {
  id: number;
  name: string;
  description: string;
  capacity: number;
}