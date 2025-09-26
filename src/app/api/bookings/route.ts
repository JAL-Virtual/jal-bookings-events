import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Define the type for booking with event included
type BookingWithEvent = {
  id: string;
  eventId: string;
  pilotId: string;
  pilotName: string;
  pilotEmail: string;
  jalId: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  event: {
    id: string;
    name: string;
    description: string | null;
    departure: string;
    arrival: string;
    date: Date;
    time: string;
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
  };
};

const ADMIN_API_KEY = "29e2bb1d4ae031ed47b6";

// GET - List all bookings for a user or admin view
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pilotId = searchParams.get('pilotId');
    const eventId = searchParams.get('eventId');
    const adminApiKey = searchParams.get('adminApiKey');

    // Admin access - view all bookings for an event
    if (adminApiKey === ADMIN_API_KEY && eventId) {
      const bookings = await prisma.booking.findMany({
        where: { eventId },
        include: {
          event: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        bookings: bookings.map((booking: BookingWithEvent) => ({
          id: booking.id,
          eventId: booking.eventId,
          pilotId: booking.pilotId,
          pilotName: booking.pilotName,
          pilotEmail: booking.pilotEmail,
          jalId: booking.jalId,
          status: booking.status,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          // Include flight details from the booking or event
          airline: booking.event.airline,
          flightNumber: booking.event.flightNumber,
          aircraft: booking.event.aircraft,
          origin: booking.event.origin || booking.event.departure,
          destination: booking.event.destination || booking.event.arrival,
          eobtEta: booking.event.eobtEta,
          stand: booking.event.stand,
          event: {
            id: booking.event.id,
            name: booking.event.name,
            description: booking.event.description,
            departure: booking.event.departure,
            arrival: booking.event.arrival,
            date: booking.event.date,
            time: booking.event.time,
            picture: booking.event.picture,
            route: booking.event.route,
            flightNumber: booking.event.flightNumber,
            aircraft: booking.event.aircraft,
            origin: booking.event.origin,
            destination: booking.event.destination,
            eobtEta: booking.event.eobtEta,
            stand: booking.event.stand,
            currentBookings: booking.event.currentBookings,
            status: booking.event.status
          }
        }))
      });
    }

    // Pilot access - view own bookings
    if (!pilotId) {
      return NextResponse.json(
        { error: "Pilot ID is required for pilot access, or admin API key with event ID for admin access" },
        { status: 400 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: { pilotId },
      include: {
        event: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      bookings: bookings.map((booking: BookingWithEvent) => ({
        id: booking.id,
        eventId: booking.eventId,
        pilotId: booking.pilotId,
        pilotName: booking.pilotName,
        pilotEmail: booking.pilotEmail,
        jalId: booking.jalId,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        event: {
          id: booking.event.id,
          name: booking.event.name,
          description: booking.event.description,
          departure: booking.event.departure,
          arrival: booking.event.arrival,
          date: booking.event.date,
          time: booking.event.time,
          picture: booking.event.picture,
          route: booking.event.route,
          flightNumber: booking.event.flightNumber,
          aircraft: booking.event.aircraft,
          origin: booking.event.origin,
          destination: booking.event.destination,
          eobtEta: booking.event.eobtEta,
          stand: booking.event.stand,
          currentBookings: booking.event.currentBookings,
          status: booking.event.status
        }
      }))
    });

  } catch (error: unknown) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new booking
export async function POST(req: Request) {
  try {
    const { eventId, pilotId, pilotName, pilotEmail, jalId, slotId } = await req.json();

    // Validate required fields
    if (!eventId || !pilotId || !pilotName || !pilotEmail) {
      return NextResponse.json(
        { error: "Event ID, pilot ID, pilot name, and pilot email are required" },
        { status: 400 }
      );
    }

    // Check if event exists and is available
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { bookings: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (event.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: "Event is not available for booking" },
        { status: 400 }
      );
    }

    // If slotId is provided, handle slot-specific booking
    if (slotId) {
      // Check if slot exists and is available
      const slot = await prisma.slot.findUnique({
        where: { id: slotId }
      });

      if (!slot) {
        return NextResponse.json(
          { error: "Slot not found" },
          { status: 404 }
        );
      }

      if (slot.status !== 'AVAILABLE') {
        return NextResponse.json(
          { error: "Slot is not available for booking" },
          { status: 400 }
        );
      }

      if (slot.eventId !== eventId) {
        return NextResponse.json(
          { error: "Slot does not belong to the specified event" },
          { status: 400 }
        );
      }

      // Check if pilot already booked this specific slot
      const existingSlotBooking = await prisma.booking.findFirst({
        where: {
          eventId,
          pilotId,
          slotId
        }
      });

      if (existingSlotBooking) {
        return NextResponse.json(
          { error: "You have already booked this slot" },
          { status: 400 }
        );
      }
    }

    // Check if pilot already booked this event (for non-slot bookings)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        eventId,
        pilotId
      }
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "You have already booked this event" },
        { status: 400 }
      );
    }

    // Create booking
    const newBooking = await prisma.booking.create({
      data: {
        eventId,
        slotId: slotId || null,
        pilotId,
        pilotName,
        pilotEmail,
        jalId,
        status: 'PENDING'
      }
    });

    // If this is a slot booking, update the slot status to OCCUPIED
    if (slotId) {
      await prisma.slot.update({
        where: { id: slotId },
        data: { status: 'OCCUPIED' }
      });
    }

    // Update event booking count
    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentBookings: event.currentBookings + 1
      }
    });

    return NextResponse.json({
      success: true,
      booking: newBooking
    });

  } catch (error: unknown) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel booking
export async function DELETE(req: Request) {
  try {
    const { bookingId, pilotId } = await req.json();

    if (!bookingId || !pilotId) {
      return NextResponse.json(
        { error: "Booking ID and pilot ID are required" },
        { status: 400 }
      );
    }

    // Check if booking exists and belongs to pilot
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        pilotId
      },
      include: { event: true }
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id: bookingId }
    });

    // Update event booking count
    await prisma.event.update({
      where: { id: booking.eventId },
      data: {
        currentBookings: Math.max(0, booking.event.currentBookings - 1)
      }
    });

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully"
    });

  } catch (error: unknown) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}