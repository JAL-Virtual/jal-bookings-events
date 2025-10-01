import { NextRequest, NextResponse } from 'next/server';
import { getStaffCollection } from '../../../lib/mongodb';

// GET - Fetch all staff keys
export async function GET() {
  try {
    console.log('GET /api/staff-keys - Fetching staff keys from MongoDB');
    const staffCollection = await getStaffCollection();
    const staffKeys = await staffCollection.find({}).toArray();
    
    console.log('Found staff keys in database:', staffKeys);
    
    const formattedKeys = staffKeys.map(staff => ({
      id: staff._id,
      key: staff.key,
      createdAt: staff.createdAt,
      isActive: staff.isActive
    }));
    
    console.log('Formatted staff keys:', formattedKeys);
    
    return NextResponse.json({ 
      success: true, 
      staffKeys: formattedKeys
    });
  } catch (error) {
    console.error('Error fetching staff keys:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff keys' },
      { status: 500 }
    );
  }
}

// POST - Add new staff key
export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    
    console.log('POST /api/staff-keys - Adding new staff key:', key);
    
    if (!key || typeof key !== 'string') {
      console.log('Invalid key provided:', key);
      return NextResponse.json(
        { success: false, error: 'Valid staff key is required' },
        { status: 400 }
      );
    }

    const staffCollection = await getStaffCollection();
    
    // Check if key already exists
    const existingStaff = await staffCollection.findOne({ key });
    console.log('Existing staff check result:', existingStaff);
    
    if (existingStaff) {
      console.log('Staff key already exists');
      return NextResponse.json(
        { success: false, error: 'Staff key already exists' },
        { status: 409 }
      );
    }

    // Create new staff key
    const newStaff = {
      key,
      createdAt: new Date(),
      isActive: true
    };
    
    console.log('Creating new staff key:', newStaff);

    const result = await staffCollection.insertOne(newStaff);
    console.log('Insert result:', result);
    
    return NextResponse.json({ 
      success: true, 
      staffKey: {
        id: result.insertedId,
        key: newStaff.key,
        createdAt: newStaff.createdAt,
        isActive: newStaff.isActive
      }
    });
  } catch (error) {
    console.error('Error creating staff key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staff key' },
      { status: 500 }
    );
  }
}

// DELETE - Remove staff key
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Staff key is required' },
        { status: 400 }
      );
    }

    const staffCollection = await getStaffCollection();
    const result = await staffCollection.deleteOne({ key });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Staff key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Staff key deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting staff key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete staff key' },
      { status: 500 }
    );
  }
}
