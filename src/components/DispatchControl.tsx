'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

interface DispatchControlProps {
  className?: string;
}

export const DispatchControl: React.FC<DispatchControlProps> = ({ className = '' }) => {
  const [aircraftCallsign, setAircraftCallsign] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState<Array<{
    id: string;
    from: string;
    message: string;
    timestamp: string;
    status: 'pending' | 'wilco' | 'acknowledge' | 'cancel';
  }>>([]);
  const { showSuccess, showError } = useToast();

  // Auto-polling effect - start immediately when component mounts
  useEffect(() => {
    // Initial poll
    handleReceiveMessages();

    // Set up auto-polling every 60 seconds
    const pollInterval = setInterval(() => {
      handleReceiveMessages();
    }, 60000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleSendMessage = async () => {
    if (!aircraftCallsign.trim() || !message.trim()) {
      showError('Please fill in both aircraft callsign and message');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get environment variables from the server
      const response = await fetch('/api/dispatch/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aircraftCallsign: aircraftCallsign.trim().toUpperCase(),
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      if (result.success) {
        showSuccess(`Message sent successfully to ${aircraftCallsign.toUpperCase()}`);
        setMessage(''); // Clear message after successful send
      } else {
        showError(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallsignChange = (value: string) => {
    // Format callsign to uppercase and remove spaces
    const formatted = value.replace(/\s/g, '').toUpperCase();
    setAircraftCallsign(formatted);
  };

  const handleReceiveMessages = async () => {
    try {
      // Call the API to poll for messages using Hoppie's POLL command
      const response = await fetch('/api/dispatch/receive-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to receive messages');
      }

      const result = await response.json();
      
      if (result.success && result.messages) {
        setReceivedMessages(result.messages);
      }
    } catch (error) {
      console.error('Error receiving messages:', error);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setReceivedMessages(prev => prev.filter(msg => msg.id !== messageId));
    showSuccess('Message deleted');
  };

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700/50 ${className}`}>
      {/* Header with Icon */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
            <span className="text-white text-lg">📡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Dispatch Control Center</h2>
            <p className="text-gray-400 text-sm">ACARS Communication Hub</p>
          </div>
        </div>
      </div>


      {/* Form - Enhanced */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/30">
        <div className="space-y-4">
          {/* Aircraft Callsign Input */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Aircraft Callsign *
            </label>
            <div className="relative">
              <input
                type="text"
                value={aircraftCallsign}
                onChange={(e) => handleCallsignChange(e.target.value)}
                placeholder="e.g., JAL123"
                className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                maxLength={10}
              />
              <div className="absolute right-3 top-2 text-gray-400 text-xs">
                ✈️
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Message *
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to the pilot..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-700/80 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200 resize-none"
                maxLength={500}
              />
              <div className="absolute right-3 top-2 text-gray-400 text-xs">
                💬
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-400">
                {message.length}/500 characters
              </div>
              <div className={`text-xs ${message.length > 450 ? 'text-yellow-400' : 'text-gray-500'}`}>
                {message.length > 450 ? '⚠️ Approaching limit' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Button - Enhanced */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !aircraftCallsign.trim() || !message.trim()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none flex items-center shadow-lg"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Transmitting...
            </>
          ) : (
            <>
              <span className="mr-2">📤</span>
              Send Message
            </>
          )}
        </button>
      </div>

      {/* Message Center Section - Enhanced */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white text-sm">📥</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Message Center</h3>
              <p className="text-xs text-gray-400">Live ACARS Communication</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div className="text-xs text-gray-400">Auto-refresh 60s</div>
          </div>
        </div>
        
        {/* Messages List */}
        {receivedMessages.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {receivedMessages.map((msg) => (
              <div
                key={msg.id}
                className={`bg-gradient-to-r rounded-xl p-4 border-l-4 shadow-lg transition-all duration-200 hover:shadow-xl ${
                  msg.status === 'wilco' 
                    ? 'border-green-400 from-green-900/30 to-green-800/20' 
                    : msg.status === 'acknowledge'
                    ? 'border-blue-400 from-blue-900/30 to-blue-800/20'
                    : msg.status === 'cancel'
                    ? 'border-red-400 from-red-900/30 to-red-800/20'
                    : 'border-yellow-400 from-yellow-900/30 to-yellow-800/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                      msg.status === 'wilco' 
                        ? 'bg-green-500' 
                        : msg.status === 'acknowledge'
                        ? 'bg-blue-500'
                        : msg.status === 'cancel'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}>
                      <span className="text-white text-xs font-bold">{msg.from.charAt(0)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-blue-200">{msg.from}</span>
                      <div className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold shadow-sm ${
                      msg.status === 'wilco' 
                        ? 'bg-green-600 text-white' 
                        : msg.status === 'acknowledge'
                        ? 'bg-blue-600 text-white'
                        : msg.status === 'cancel'
                        ? 'bg-red-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {msg.status.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="px-3 py-1 bg-red-600/80 hover:bg-red-600 text-white text-xs rounded-lg transition-all duration-200 hover:scale-105 shadow-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-3 mt-2">
                  <p className="text-gray-100 text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-xl p-6 text-center border border-gray-600/30">
            <div className="w-16 h-16 bg-gray-600/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-2xl">📭</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">No messages received yet</p>
            <p className="text-xs text-gray-400 mt-1">Messages will appear automatically when aircraft send them</p>
          </div>
        )}
      </div>
    </div>
  );
};
