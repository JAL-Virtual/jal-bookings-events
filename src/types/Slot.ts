export interface Slot {
  id: number;
  flightNumber?: string;
  aircraft?: string;
  origin: string;
  destination: string;
  slotTime: string;
  gate: string;
  type: SlotType;
  owner?: {
    vid: string;
    firstName?: string;
    lastName?: string;
  };
  bookingStatus: BookingStatus;
}

export enum SlotType {
  TAKEOFF = 'takeoff',
  LANDING = 'landing',
  TAKEOFF_LANDING = 'takeoff_landing'
}

export enum BookingStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export enum SlotBookActions {
  BOOK = 'book',
  CANCEL = 'cancel',
  CONFIRM = 'confirm'
}

export interface SlotScheduleData {
  flightNumber: string;
  aircraft: string;
  origin: string;
  destination: string;
}

export function getSlotAirline(slot: Slot): string {
  if (!slot.flightNumber) return '';
  return slot.flightNumber.substring(0, 3);
}

export function isBookable(slot: Slot): boolean {
  return !slot.owner && slot.bookingStatus === BookingStatus.AVAILABLE;
}
