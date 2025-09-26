import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const ADMIN_API_KEY = "29e2bb1d4ae031ed47b6";

// GET - List all events
export async function GET() {
  try {
    // Allow public access for viewing events (no authentication required for GET)
    // Admin API key is only required for POST, PUT, DELETE operations

    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        bookings: true
      }
    });

    console.log('API: Found events:', events.length);
    console.log('API: Events data:', events);

    return NextResponse.json({
      success: true,
      events: events.map(event => ({
        id: event.id,
        name: event.name,
        description: event.description,
        departure: event.departure,
        arrival: event.arrival,
        date: event.date,
        time: event.time,
        picture: event.picture,
        route: event.route,
        airline: event.airline,
        flightNumber: event.flightNumber,
        aircraft: event.aircraft,
        origin: event.origin,
        destination: event.destination,
        eobtEta: event.eobtEta,
        stand: event.stand,
        maxPilots: event.maxPilots,
        currentBookings: event.currentBookings,
        status: event.status,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
        bookings: event.bookings
      }))
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

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

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData
    });

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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete event (bookings will be deleted due to cascade)
    await prisma.event.delete({
      where: { id }
    });

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