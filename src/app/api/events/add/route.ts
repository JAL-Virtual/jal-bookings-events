import { NextResponse } from "next/server";
import { getEventsCollection, getAuditLogsCollection } from "../../../../lib/mongodb";

const ADMIN_API_KEY = "29e2bb1d4ae031ed47b6";

// POST - Add new event
export async function POST(req: Request) {
  try {
    const { name, description, departure, arrival, date, time, picture, route, airline, maxPilots, adminApiKey } = await req.json();

    // Validate administrator API key
    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid administrator API key" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!name || !departure || !arrival || !date || !time) {
      return NextResponse.json(
        { error: "Name, departure, arrival, date, and time are required" },
        { status: 400 }
      );
    }

    // Create new event
    const eventsCollection = await getEventsCollection();
    
    const eventData = {
      name,
      description,
      departure,
      arrival,
      date: new Date(date),
      time,
      picture,
      route,
      airline,
      maxPilots: maxPilots || 10,
      currentBookings: 0,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await eventsCollection.insertOne(eventData);
    const newEvent = await eventsCollection.findOne({ _id: result.insertedId });

    // Log audit event for creation
    const auditLogsCollection = await getAuditLogsCollection();
    await auditLogsCollection.insertOne({
      eventId: result.insertedId.toString(),
      eventName: name,
      eventData: newEvent,
      action: 'created',
      timestamp: new Date().toISOString(),
      adminId: '29e2bb1d4ae031ed47b6'
    });

    return NextResponse.json({
      success: true,
      event: newEvent
    });

  } catch (error: unknown) {
    console.error('Error adding event:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
