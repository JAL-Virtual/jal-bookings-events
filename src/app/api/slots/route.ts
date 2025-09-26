import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_API_KEY = "29e2bb1d4ae031ed47b6";

// Define the type for slot with event included
type SlotWithEvent = {
  id: string;
  eventId: string;
  slotNumber: string;
  type: string;
  airline: string | null;
  flightNumber: string | null;
  aircraft: string | null;
  origin: string | null;
  destination: string | null;
  eobtEta: string | null;
  stand: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  event: {
    id: string;
    name: string;
    departure: string;
    arrival: string;
  };
};

// GET - Fetch all slots for an event
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const type = searchParams.get('type'); // DEPARTURE or ARRIVAL

    // Allow public access for viewing slots (no authentication required for GET)
    // Admin API key is only required for POST, PUT, DELETE operations

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const whereClause: Record<string, unknown> = { eventId };
    if (type && (type === 'DEPARTURE' || type === 'ARRIVAL')) {
      whereClause.type = type;
    }

    const slots = await prisma.slot.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        event: true
      }
    });

    return NextResponse.json({
      success: true,
      slots: slots.map((slot: SlotWithEvent) => ({
        id: slot.id,
        eventId: slot.eventId,
        slotNumber: slot.slotNumber,
        type: slot.type,
        airline: slot.airline,
        flightNumber: slot.flightNumber,
        aircraft: slot.aircraft,
        origin: slot.origin,
        destination: slot.destination,
        eobtEta: slot.eobtEta,
        stand: slot.stand,
        status: slot.status,
        createdAt: slot.createdAt,
        updatedAt: slot.updatedAt,
        event: {
          id: slot.event.id,
          name: slot.event.name,
          departure: slot.event.departure,
          arrival: slot.event.arrival
        }
      }))
    });

  } catch (error: unknown) {
    console.error('Error fetching slots:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new slot
export async function POST(req: Request) {
  try {
    const { 
      eventId, 
      slotNumber, 
      type, 
      airline, 
      flightNumber, 
      aircraft, 
      origin, 
      destination, 
      eobtEta, 
      stand, 
      adminApiKey 
    } = await req.json();

    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!eventId || !slotNumber || !type) {
      return NextResponse.json(
        { error: "Event ID, slot number, and type are required" },
        { status: 400 }
      );
    }

    if (type !== 'DEPARTURE' && type !== 'ARRIVAL') {
      return NextResponse.json(
        { error: "Type must be either DEPARTURE or ARRIVAL" },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if slot number already exists for this event and type
    const existingSlot = await prisma.slot.findFirst({
      where: {
        eventId,
        slotNumber,
        type
      }
    });

    if (existingSlot) {
      return NextResponse.json(
        { error: `Slot number ${slotNumber} already exists for ${type.toLowerCase()} slots in this event` },
        { status: 400 }
      );
    }

    const newSlot = await prisma.slot.create({
      data: {
        eventId,
        slotNumber,
        type,
        airline,
        flightNumber,
        aircraft,
        origin,
        destination,
        eobtEta,
        stand,
        status: 'AVAILABLE'
      }
    });

    return NextResponse.json({
      success: true,
      slot: newSlot
    });

  } catch (error: unknown) {
    console.error('Error creating slot:', error);
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: "Invalid event ID or foreign key constraint violation" },
          { status: 400 }
        );
      }
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Slot number already exists for this slot type in this event" },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update slot
export async function PUT(req: Request) {
  try {
    const { 
      id, 
      slotNumber, 
      type, 
      airline, 
      flightNumber, 
      aircraft, 
      origin, 
      destination, 
      eobtEta, 
      stand, 
      status, 
      adminApiKey 
    } = await req.json();

    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
    }

    // Check if slot exists
    const existingSlot = await prisma.slot.findUnique({
      where: { id }
    });

    if (!existingSlot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    // Prepare update data - only include fields that have values
    const updateData: Record<string, unknown> = {};
    
    if (slotNumber !== undefined) updateData.slotNumber = slotNumber;
    if (type !== undefined) updateData.type = type;
    if (airline !== undefined) updateData.airline = airline;
    if (flightNumber !== undefined) updateData.flightNumber = flightNumber;
    if (aircraft !== undefined) updateData.aircraft = aircraft;
    if (origin !== undefined) updateData.origin = origin;
    if (destination !== undefined) updateData.destination = destination;
    if (eobtEta !== undefined) updateData.eobtEta = eobtEta;
    if (stand !== undefined) updateData.stand = stand;
    if (status !== undefined) updateData.status = status;

    const updatedSlot = await prisma.slot.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      slot: updatedSlot
    });

  } catch (error: unknown) {
    console.error('Error updating slot:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete slot
export async function DELETE(req: Request) {
  try {
    const { id, adminApiKey } = await req.json();

    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
    }

    const slot = await prisma.slot.findUnique({
      where: { id }
    });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    await prisma.slot.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Slot deleted successfully"
    });

  } catch (error: unknown) {
    console.error('Error deleting slot:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
