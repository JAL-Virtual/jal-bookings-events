export interface Scenary {
  id: string;
  title: string;
  link: string;
  simulator: ScenarySimulators;
  license: "freeware" | "payware";
}

export enum ScenarySimulators {
  MSFS = "msfs",
  XPLANE = "xplane",
  P3D = "p3d",
  FSX = "fsx"
}

export interface EventDetailEvent {
  id: string;
  eventName: string;
  type: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  pilotBriefing: string;
  atcBriefing: string;
  banner: string;
  airports: {
    icao: string;
    sceneries: Scenary[];
  }[];
}
