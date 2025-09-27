/**
 * Google Calendar integration utilities
 */

export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
}

/**
 * Generates a Google Calendar URL for adding an event
 * @param event - The calendar event details
 * @returns Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    dates: `${formatDateForGoogleCalendar(event.startDate)}/${formatDateForGoogleCalendar(event.endDate)}`,
    ...(event.location && { location: event.location }),
    trp: 'false',
    sf: 'true',
    output: 'xml'
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Formats a date for Google Calendar (YYYYMMDDTHHMMSSZ format)
 * @param date - The date to format
 * @returns Formatted date string
 */
function formatDateForGoogleCalendar(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Creates a calendar event for a flight booking
 * @param booking - The booking details
 * @returns Calendar event object
 */
export function createFlightCalendarEvent(booking: {
  eventName: string;
  flightNumber?: string;
  aircraft?: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  slotNumber: string;
  pilotName: string;
}): CalendarEvent {
  const startDate = new Date(booking.departureTime);
  const endDate = new Date(booking.arrivalTime);
  
  const title = `${booking.eventName} - ${booking.flightNumber || 'Flight'} (${booking.slotNumber})`;
  
  const description = [
    `Event: ${booking.eventName}`,
    `Flight: ${booking.flightNumber || 'TBD'}`,
    `Aircraft: ${booking.aircraft || 'TBD'}`,
    `Route: ${booking.origin} → ${booking.destination}`,
    `Slot: ${booking.slotNumber}`,
    `Pilot: ${booking.pilotName}`,
    '',
    'Booked via JAL Virtual Event Portal'
  ].join('\n');
  
  const location = `${booking.origin} Airport`;

  return {
    title,
    description,
    startDate,
    endDate,
    location
  };
}

/**
 * Opens Google Calendar in a new tab with the event pre-filled
 * @param event - The calendar event details
 */
export function addToGoogleCalendar(event: CalendarEvent): void {
  const url = generateGoogleCalendarUrl(event);
  window.open(url, '_blank', 'noopener,noreferrer');
}
