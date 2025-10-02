# Dispatch Control System

## Overview
The Dispatch Control System allows authorized staff to send ACARS messages to aircraft via the Hoppie network.

## Setup

### Environment Variables
Add these variables to your `.env` file:

```env
# Hoppie Configuration for Dispatch System
# Get your logon code from https://www.hoppie.nl/
HOPPIE_LOGON_CODE=your_hoppie_logon_code_here

# Your dispatch callsign (e.g., JALDispatch, JALOPS, etc.)
DISPATCH_CALLSIGN=JALDispatch
```

### Getting Hoppie Logon Code
1. Visit https://www.hoppie.nl/
2. Register for an account
3. Request a logon code for your virtual airline
4. Add the logon code to your environment variables

## Features

### Current Implementation
- ✅ Aircraft callsign input with validation
- ✅ Message composition with character limit (500 chars)
- ✅ Instructions box explaining how to use Hoppie
- ✅ Send button with loading states
- ✅ Toast notifications for success/error feedback
- ✅ Integration with dashboard for staff/admin access

### How to Use
1. Navigate to the Dispatch tab (requires staff/admin access)
2. Enter the aircraft callsign (e.g., JAL123, ANA456)
3. Type your message to the pilot
4. Click "Send Message" to transmit via ACARS
5. The system will show success/error notifications

### API Endpoint
The system uses `/api/dispatch/send-message` to handle message sending:
- **Method**: POST
- **Body**: `{ aircraftCallsign: string, message: string }`
- **Response**: `{ success: boolean, message?: string, error?: string }`

## Future Enhancements
- Message history and logging
- Receive and acknowledge messages from aircraft
- Message templates
- Bulk messaging capabilities
- Real-time message status updates

## Security
- Only staff and admin users can access the dispatch system
- Environment variables are server-side only
- Input validation and sanitization implemented
