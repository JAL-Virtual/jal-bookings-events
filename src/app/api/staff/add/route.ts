import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const ADMIN_API_KEY = "29e2bb1d4ae031ed47b6";

export async function POST(req: Request) {
  try {
    const { name, email, apiKey, role, department, accessLevel, adminApiKey } = await req.json();
    
    // Validate administrator API key
    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid administrator API key" },
        { status: 401 }
      );
    }
    
    // Validate required fields
    if (!name || !email || !role || !apiKey) {
      return NextResponse.json(
        { error: "Name, email, role, and API key are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingStaff = await prisma.staffMember.findUnique({
      where: { email }
    });

    if (existingStaff) {
      return NextResponse.json(
        { error: "Staff member with this email already exists" },
        { status: 409 }
      );
    }

    // Check if API key already exists
    const existingApiKey = await prisma.staffMember.findUnique({
      where: { apiKey }
    });

    if (existingApiKey) {
      return NextResponse.json(
        { error: "API key already exists. Please generate a new one." },
        { status: 409 }
      );
    }

    // Create staff member in database
    const staffMember = await prisma.staffMember.create({
      data: {
        name,
        email,
        apiKey,
        role: role as 'ADMINISTRATOR' | 'STAFF_MEMBER',
        department: department || 'General',
        accessLevel: (accessLevel || 'STAFF') as 'STAFF' | 'ADMIN' | 'SUPER_ADMIN',
        status: 'PENDING'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Staff member added successfully",
      staffMember: {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        department: staffMember.department,
        accessLevel: staffMember.accessLevel,
        status: staffMember.status,
        createdAt: staffMember.createdAt
      }
    });

  } catch (error: unknown) {
    console.error('Error adding staff member:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
