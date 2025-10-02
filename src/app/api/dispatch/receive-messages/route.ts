import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Add CORS headers for better compatibility
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Get environment variables
    const hoppieLogonCode = process.env.HOPPIE_LOGON_CODE;
    const dispatchCallsign = process.env.DISPATCH_CALLSIGN;

    if (!hoppieLogonCode || !dispatchCallsign) {
      return NextResponse.json(
        { success: false, error: 'Hoppie configuration not found' },
        { status: 500, headers }
      );
    }

    // Use Hoppie's POLL command to retrieve pending messages
    // According to the documentation: "This message polls the communication server for pending messages directed to your callsign"
    const hoppieUrl = `http://www.hoppie.nl/acars/system/connect.html?logon=${hoppieLogonCode}&from=${dispatchCallsign}&to=${dispatchCallsign}&type=poll&packet=`;

    // Send the poll request to Hoppie
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
    
    // Parse the response from Hoppie
    // The response format is typically: "OK" followed by message data
    if (responseText.toLowerCase().includes('ok')) {
      // Parse messages from the response
      const messages = parseHoppieMessages(responseText, dispatchCallsign);
      
      return NextResponse.json({
        success: true,
        messages: messages,
        rawResponse: responseText,
        timestamp: new Date().toISOString(),
      }, { headers });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to poll messages from Hoppie' },
        { status: 500, headers }
      );
    }

  } catch (error) {
    console.error('Error polling Hoppie messages:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }}
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Parse Hoppie's response format into our message structure
function parseHoppieMessages(responseText: string, dispatchCallsign: string) {
  const messages: Array<{
    id: string;
    from: string;
    message: string;
    timestamp: string;
    status: 'pending' | 'wilco' | 'acknowledge' | 'cancel';
  }> = [];

  try {
    // Hoppie's response format varies, but typically contains message data after "OK"
    // The exact format depends on the message type (telex, progress, etc.)
    
    const lines = responseText.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for message patterns in the response
      if (line && !line.toLowerCase().includes('ok') && line.length > 10) {
        // Extract callsign and message content
        const parts = line.split(' ');
        if (parts.length >= 2) {
          const from = parts[0];
          const messageContent = parts.slice(1).join(' ');
          
          // Only include messages that aren't from ourselves
          if (from !== dispatchCallsign && from.length >= 3) {
            // Determine status based on message content
            let status: 'pending' | 'wilco' | 'acknowledge' | 'cancel' = 'pending';
            
            const messageLower = messageContent.toLowerCase();
            if (messageLower.includes('wilco')) {
              status = 'wilco';
            } else if (messageLower.includes('acknowledge') || messageLower.includes('ack')) {
              status = 'acknowledge';
            } else if (messageLower.includes('cancel') || messageLower.includes('unable')) {
              status = 'cancel';
            }
            
            messages.push({
              id: `msg_${Date.now()}_${i}`,
              from: from,
              message: messageContent,
              timestamp: new Date().toISOString(),
              status: status
            });
          }
        }
      }
    }
  } catch (parseError) {
    console.error('Error parsing Hoppie messages:', parseError);
  }

  return messages;
}
