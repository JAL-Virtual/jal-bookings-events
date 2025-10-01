import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogsCollection } from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminApiKey = searchParams.get('adminApiKey');

    // Verify admin access
    if (adminApiKey !== '29e2bb1d4ae031ed47b6') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const auditLogsCollection = await getAuditLogsCollection();
    const auditLogs = await auditLogsCollection
      .find({})
      .sort({ timestamp: -1 }) // Most recent first
      .toArray();

    return NextResponse.json({
      success: true,
      auditLogs: auditLogs
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
