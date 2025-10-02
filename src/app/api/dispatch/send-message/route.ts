import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { aircraftCallsign, message } = await request.json();

    if (!aircraftCallsign || !message) {
      return NextResponse.json(
        { success: false, error: 'Aircraft callsign and message are required' },
        { status: 400 }
      );
    }

    // Get environment variables
    const hoppieLogonCode = process.env.HOPPIE_LOGON_CODE;
    const dispatchCallsign = process.env.DISPATCH_CALLSIGN;

    if (!hoppieLogonCode || !dispatchCallsign) {
      return NextResponse.json(
        { success: false, error: 'Hoppie configuration not found' },
        { status: 500 }
      );
    }

    // Construct the Hoppie API URL
    const hoppieUrl = `http://www.hoppie.nl/acars/system/connect.html?logon=${hoppieLogonCode}&from=${dispatchCallsign}&to=${aircraftCallsign}&type=telex&packet=${encodeURIComponent(message)}`;

    // Send the message to Hoppie
    const response = await fetch(hoppieUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'JAL-Dispatch-System/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Hoppie API responded with status: ${response.status}`);
    }

    const responseText = await response.text();
    
    // Check if the response indicates success
    // Hoppie typically returns "ok" for successful messages
    if (responseText.toLowerCase().includes('ok')) {
      return NextResponse.json({
        success: true,
        message: `Message sent successfully to ${aircraftCallsign}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send message via Hoppie' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending Hoppie message:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
