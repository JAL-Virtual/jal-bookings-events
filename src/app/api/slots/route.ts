import { NextResponse } from "next/server";
import { getSlotsCollection, getEventsCollection } from "../../../lib/mongodb";

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

    const slotsCollection = await getSlotsCollection();
    const eventsCollection = await getEventsCollection();
    
    const query: Record<string, unknown> = { eventId };
    if (type && (type === 'DEPARTURE' || type === 'ARRIVAL')) {
      query.type = type;
    }

    const slots = await slotsCollection.find(query).sort({ createdAt: -1 }).toArray();
    
    // Get event details for each slot
    const slotsWithEvents = await Promise.all(
      slots.map(async (slot) => {
        const event = await eventsCollection.findOne({ _id: slot.eventId });
        return {
          id: slot._id.toString(),
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
          event
        };
      })
    );

    return NextResponse.json({
      success: true,
      slots: slotsWithEvents.map((slot) => ({
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
        event: slot.event ? {
          id: slot.event._id.toString(),
          name: slot.event.name,
          departure: slot.event.departure,
          arrival: slot.event.arrival
        } : null
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

    const slotsCollection = await getSlotsCollection();
    const eventsCollection = await getEventsCollection();
    const { ObjectId } = await import('mongodb');

    // Check if event exists
    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if slot number already exists for this event and type
    const existingSlot = await slotsCollection.findOne({
      eventId,
      slotNumber,
      type
    });

    if (existingSlot) {
      return NextResponse.json(
        { error: `Slot number ${slotNumber} already exists for ${type.toLowerCase()} slots in this event` },
        { status: 400 }
      );
    }

    const slotData = {
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
      status: 'AVAILABLE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await slotsCollection.insertOne(slotData);
    const newSlot = await slotsCollection.findOne({ _id: result.insertedId });

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

    const slotsCollection = await getSlotsCollection();
    const { ObjectId } = await import('mongodb');

    // Check if slot exists
    const existingSlot = await slotsCollection.findOne({ _id: new ObjectId(id) });

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

    updateData.updatedAt = new Date();

    const result = await slotsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    const updatedSlot = await slotsCollection.findOne({ _id: new ObjectId(id) });

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

    const slotsCollection = await getSlotsCollection();
    const { ObjectId } = await import('mongodb');

    const slot = await slotsCollection.findOne({ _id: new ObjectId(id) });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    await slotsCollection.deleteOne({ _id: new ObjectId(id) });

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
