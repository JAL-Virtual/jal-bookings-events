import { NextResponse } from "next/server";
import { getStaffCollection } from "../../../lib/mongodb";

const ADMIN_API_KEY = "29e2bb1d4ae031ed47b6";

// GET - List all staff members
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const adminApiKey = searchParams.get('adminApiKey');

    // Validate administrator API key
    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid administrator API key" },
        { status: 401 }
      );
    }

    const staffMembers = await prisma.staffMember.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      staffMembers: staffMembers.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        accessLevel: member.accessLevel,
        status: member.status,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        lastLogin: member.lastLogin
      }))
    });

  } catch (error: unknown) {
    console.error('Error fetching staff members:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update staff member
export async function PUT(req: Request) {
  try {
    const { id, name, email, apiKey, role, department, accessLevel, adminApiKey } = await req.json();

    // Validate administrator API key
    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid administrator API key" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Staff member ID is required" },
        { status: 400 }
      );
    }

    // Check if staff member exists
    const existingStaff = await prisma.staffMember.findUnique({
      where: { id }
    });

    if (!existingStaff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingStaff.email) {
      const emailExists = await prisma.staffMember.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
    }

    // Check if API key is being changed and if it already exists
    if (apiKey && apiKey !== existingStaff.apiKey) {
      const apiKeyExists = await prisma.staffMember.findUnique({
        where: { apiKey }
      });

      if (apiKeyExists) {
        return NextResponse.json(
          { error: "API key already exists" },
          { status: 409 }
        );
      }
    }

    // Update staff member
    const updatedStaff = await prisma.staffMember.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(apiKey && { apiKey }),
        ...(role && { role: role as 'ADMINISTRATOR' | 'STAFF_MEMBER' }),
        ...(department && { department }),
        ...(accessLevel && { accessLevel: accessLevel as 'STAFF' | 'ADMIN' | 'SUPER_ADMIN' })
      }
    });

    return NextResponse.json({
      success: true,
      message: "Staff member updated successfully",
      staffMember: {
        id: updatedStaff.id,
        name: updatedStaff.name,
        email: updatedStaff.email,
        role: updatedStaff.role,
        department: updatedStaff.department,
        accessLevel: updatedStaff.accessLevel,
        status: updatedStaff.status,
        updatedAt: updatedStaff.updatedAt
      }
    });

  } catch (error: unknown) {
    console.error('Error updating staff member:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete staff member
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const adminApiKey = searchParams.get('adminApiKey');

    // Validate administrator API key
    if (adminApiKey !== ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid administrator API key" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Staff member ID is required" },
        { status: 400 }
      );
    }

    // Check if staff member exists
    const existingStaff = await prisma.staffMember.findUnique({
      where: { id }
    });

    if (!existingStaff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Delete staff member
    await prisma.staffMember.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "Staff member deleted successfully"
    });

  } catch (error: unknown) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
