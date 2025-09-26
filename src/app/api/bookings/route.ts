import { NextResponse } from "next/server";
import { getBookingsCollection, getEventsCollection, getSlotsCollection } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

interface Booking {
  _id?: ObjectId;
  eventId: ObjectId;
  slotId?: ObjectId;
  pilotId: string;
  pilotName: string;
  pilotEmail: string;
  jalId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

interface BookingWithEvent extends Booking {
  id: string;
  event: Event | null;
}

interface Event {
  _id?: ObjectId;
  name: string;
  description?: string;
  departure: string;
  arrival: string;
  date: Date;
  time: string;
  picture?: string;
  route?: string;
  airline?: string;
  flightNumber?: string;
  aircraft?: string;
  origin?: string;
  destination?: string;
  eobtEta?: string;
  stand?: string;
  maxPilots: number;
  currentBookings: number;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

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
      const bookingsCollection = await getBookingsCollection();
      const eventsCollection = await getEventsCollection();
      
      const bookings = await bookingsCollection.find({ eventId }).sort({ createdAt: -1 }).toArray();
      
      // Get event details for each booking
      const bookingsWithEvents = await Promise.all(
        bookings.map(async (booking) => {
          const event = await eventsCollection.findOne({ _id: booking.eventId });
          return {
            ...booking,
            id: booking._id.toString(),
            event
          };
        })
      );

      return NextResponse.json({
        success: true,
        bookings: bookingsWithEvents.map((booking) => ({
          id: booking.id,
          eventId: (booking as BookingWithEvent).eventId,
          pilotId: (booking as BookingWithEvent).pilotId,
          pilotName: (booking as BookingWithEvent).pilotName,
          pilotEmail: (booking as BookingWithEvent).pilotEmail,
          jalId: (booking as BookingWithEvent).jalId,
          status: (booking as BookingWithEvent).status,
          createdAt: (booking as BookingWithEvent).createdAt,
          updatedAt: (booking as BookingWithEvent).updatedAt,
          // Include flight details from the booking or event
          airline: booking.event?.airline,
          flightNumber: booking.event?.flightNumber,
          aircraft: booking.event?.aircraft,
          origin: booking.event?.origin || booking.event?.departure,
          destination: booking.event?.destination || booking.event?.arrival,
          eobtEta: booking.event?.eobtEta,
          stand: booking.event?.stand,
          event: booking.event ? {
            id: booking.event._id.toString(),
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
          } : null
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

    const bookingsCollection = await getBookingsCollection();
    const eventsCollection = await getEventsCollection();
    
    const bookings = await bookingsCollection.find({ pilotId }).sort({ createdAt: -1 }).toArray();
    
    // Get event details for each booking
    const bookingsWithEvents = await Promise.all(
      bookings.map(async (booking) => {
        const event = await eventsCollection.findOne({ _id: booking.eventId });
        return {
          ...booking,
          id: booking._id.toString(),
          event
        };
      })
    );

    return NextResponse.json({
      success: true,
      bookings: bookingsWithEvents.map((booking) => ({
        id: booking.id,
        eventId: (booking as BookingWithEvent).eventId,
        pilotId: (booking as BookingWithEvent).pilotId,
        pilotName: (booking as BookingWithEvent).pilotName,
        pilotEmail: (booking as BookingWithEvent).pilotEmail,
        jalId: (booking as BookingWithEvent).jalId,
        status: (booking as BookingWithEvent).status,
        createdAt: (booking as BookingWithEvent).createdAt,
        updatedAt: (booking as BookingWithEvent).updatedAt,
        event: booking.event ? {
          id: booking.event._id.toString(),
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
        } : null
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
    const eventsCollection = await getEventsCollection();
    const { ObjectId } = await import('mongodb');
    
    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

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
      const slotsCollection = await getSlotsCollection();
      
      // Check if slot exists and is available
      const slot = await slotsCollection.findOne({ _id: new ObjectId(slotId) });

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
      const bookingsCollection = await getBookingsCollection();
      const existingSlotBooking = await bookingsCollection.findOne({
        eventId,
        pilotId,
        slotId
      });

      if (existingSlotBooking) {
        return NextResponse.json(
          { error: "You have already booked this slot" },
          { status: 400 }
        );
      }
    }

    // Check if pilot already booked this event (for non-slot bookings)
    const bookingsCollection = await getBookingsCollection();
    const existingBooking = await bookingsCollection.findOne({
      eventId,
      pilotId
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "You have already booked this event" },
        { status: 400 }
      );
    }

    // Create booking
    const bookingData = {
      eventId,
      slotId: slotId || null,
      pilotId,
      pilotName,
      pilotEmail,
      jalId,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await bookingsCollection.insertOne(bookingData);
    const newBooking = await bookingsCollection.findOne({ _id: result.insertedId });

    // If this is a slot booking, update the slot status to OCCUPIED
    if (slotId) {
      const slotsCollection = await getSlotsCollection();
      await slotsCollection.updateOne(
        { _id: new ObjectId(slotId) },
        { $set: { status: 'OCCUPIED', updatedAt: new Date() } }
      );
    }

    // Update event booking count
    await eventsCollection.updateOne(
      { _id: new ObjectId(eventId) },
      { 
        $set: { 
          currentBookings: event.currentBookings + 1,
          updatedAt: new Date()
        } 
      }
    );

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
    const bookingsCollection = await getBookingsCollection();
    const eventsCollection = await getEventsCollection();
    const { ObjectId } = await import('mongodb');
    
    const booking = await bookingsCollection.findOne({
      _id: new ObjectId(bookingId),
      pilotId
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Get event details
    const event = await eventsCollection.findOne({ _id: new ObjectId(booking.eventId) });

    // Delete booking
    await bookingsCollection.deleteOne({ _id: new ObjectId(bookingId) });

    // Update event booking count
    if (event) {
      await eventsCollection.updateOne(
        { _id: new ObjectId(booking.eventId) },
        { 
          $set: { 
            currentBookings: Math.max(0, event.currentBookings - 1),
            updatedAt: new Date()
          } 
        }
      );
    }

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