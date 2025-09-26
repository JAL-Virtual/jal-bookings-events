import { NextResponse } from "next/server";
import { getStaffCollection } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

interface StaffMember {
  _id?: ObjectId;
  name: string;
  email: string;
  apiKey: string;
  role: 'ADMINISTRATOR' | 'STAFF_MEMBER';
  department?: string;
  accessLevel: 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

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

    const staffCollection = await getStaffCollection();
    const staffMembers = await staffCollection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      staffMembers: staffMembers.map((member) => ({
        id: member._id.toString(),
        name: (member as StaffMember).name,
        email: (member as StaffMember).email,
        role: (member as StaffMember).role,
        department: (member as StaffMember).department,
        accessLevel: (member as StaffMember).accessLevel,
        status: (member as StaffMember).status,
        createdAt: (member as StaffMember).createdAt,
        updatedAt: (member as StaffMember).updatedAt,
        lastLogin: (member as StaffMember).lastLogin
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
    const staffCollection = await getStaffCollection();
    const existingStaff = await staffCollection.findOne({ _id: new ObjectId(id) });

    if (!existingStaff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingStaff.email) {
      const emailExists = await staffCollection.findOne({ email });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
    }

    // Check if API key is being changed and if it already exists
    if (apiKey && apiKey !== existingStaff.apiKey) {
      const apiKeyExists = await staffCollection.findOne({ apiKey });

      if (apiKeyExists) {
        return NextResponse.json(
          { error: "API key already exists" },
          { status: 409 }
        );
      }
    }

    // Update staff member
    const updateData: Partial<StaffMember> = {
      updatedAt: new Date()
    };
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (apiKey) updateData.apiKey = apiKey;
    if (role) updateData.role = role as 'ADMINISTRATOR' | 'STAFF_MEMBER';
    if (department) updateData.department = department;
    if (accessLevel) updateData.accessLevel = accessLevel as 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';

    const result = await staffCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    const updatedStaff = await staffCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Staff member updated successfully",
      staffMember: {
        id: updatedStaff!._id.toString(),
        name: updatedStaff!.name,
        email: updatedStaff!.email,
        role: updatedStaff!.role,
        department: updatedStaff!.department,
        accessLevel: updatedStaff!.accessLevel,
        status: updatedStaff!.status,
        updatedAt: updatedStaff!.updatedAt
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
    const staffCollection = await getStaffCollection();
    const existingStaff = await staffCollection.findOne({ _id: new ObjectId(id) });

    if (!existingStaff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Delete staff member
    await staffCollection.deleteOne({ _id: new ObjectId(id) });

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
