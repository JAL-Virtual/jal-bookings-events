import { NextResponse } from "next/server";
import { getEventsCollection, getBookingsCollection } from "../../../lib/mongodb";
import { ObjectId, Document } from "mongodb";

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

// GET - List all events
export async function GET() {
  try {
    // Allow public access for viewing events (no authentication required for GET)
    // Admin API key is only required for POST, PUT, DELETE operations

    const eventsCollection = await getEventsCollection();
    const bookingsCollection = await getBookingsCollection();

    const events = await eventsCollection.find({}).sort({ createdAt: -1 }).toArray();

    // Get bookings for each event
    const eventsWithBookings = await Promise.all(
      events.map(async (event) => {
        const bookings = await bookingsCollection.find({ eventId: event._id.toString() }).toArray();
        return {
          ...event,
          id: event._id.toString(),
          bookings
        };
      })
    );

    console.log('API: Found events:', eventsWithBookings.length);
    console.log('API: Events data:', eventsWithBookings);

    return NextResponse.json({
      success: true,
      events: eventsWithBookings.map(event => {
        const eventData = event as unknown as Event & { id: string; bookings: Document[] };
        return {
          id: eventData.id,
          name: eventData.name,
          description: eventData.description,
          departure: eventData.departure,
          arrival: eventData.arrival,
          date: eventData.date,
          time: eventData.time,
          picture: eventData.picture,
          route: eventData.route,
          airline: eventData.airline,
          flightNumber: eventData.flightNumber,
          aircraft: eventData.aircraft,
          origin: eventData.origin,
          destination: eventData.destination,
          eobtEta: eventData.eobtEta,
          stand: eventData.stand,
          maxPilots: eventData.maxPilots,
          currentBookings: eventData.currentBookings,
          status: eventData.status,
          createdAt: eventData.createdAt,
          updatedAt: eventData.updatedAt,
          bookings: eventData.bookings
        };
      })
    });

  } catch (error: unknown) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(req: Request) {
  try {
    const { id, name, description, departure, arrival, date, time, picture, route, airline, flightNumber, aircraft, origin, destination, eobtEta, stand, maxPilots, status, adminApiKey } = await req.json();

    // Validate administrator API key
    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid administrator API key" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const eventsCollection = await getEventsCollection();
    const { ObjectId } = await import('mongodb');

    // Check if event exists
    const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Prepare update data - only include fields that have values
    const updateData: Record<string, unknown> = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (departure !== undefined) updateData.departure = departure;
    if (arrival !== undefined) updateData.arrival = arrival;
    if (date !== undefined && date !== '') {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        updateData.date = dateObj;
      }
    }
    if (time !== undefined) updateData.time = time;
    if (picture !== undefined) updateData.picture = picture;
    if (route !== undefined) updateData.route = route;
    if (airline !== undefined) updateData.airline = airline;
    if (flightNumber !== undefined) updateData.flightNumber = flightNumber;
    if (aircraft !== undefined) updateData.aircraft = aircraft;
    if (origin !== undefined) updateData.origin = origin;
    if (destination !== undefined) updateData.destination = destination;
    if (eobtEta !== undefined) updateData.eobtEta = eobtEta;
    if (stand !== undefined) updateData.stand = stand;
    if (maxPilots !== undefined) updateData.maxPilots = maxPilots;
    if (status !== undefined) updateData.status = status;

    updateData.updatedAt = new Date();

    // Update event
    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const updatedEvent = await eventsCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      event: updatedEvent
    });

  } catch (error: unknown) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(req: Request) {
  try {
    const { id, adminApiKey } = await req.json();

    // Validate administrator API key
    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid administrator API key" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const eventsCollection = await getEventsCollection();
    const bookingsCollection = await getBookingsCollection();
    const { ObjectId } = await import('mongodb');

    // Check if event exists
    const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete related bookings first
    await bookingsCollection.deleteMany({ eventId: id });

    // Delete event
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully"
    });

  } catch (error: unknown) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}