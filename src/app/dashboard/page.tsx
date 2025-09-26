'use client';

import React from 'react';
import { useEffect } from 'react';
import { 
  Sidebar, 
  EventHeader, 
  PilotBriefingCard, 
  Footer,
  StaffManagement,
  EventManagement,
  BookSlot,
  type Event
} from '../../components';
import { isAuthenticated } from '../api';


export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isStaff, setIsStaff] = React.useState(false);
  const [apiKey, setApiKey] = React.useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = React.useState<Event | null>(null);
  const [eventLoading, setEventLoading] = React.useState(true);
  const [refreshInterval, setRefreshInterval] = React.useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/';
      return;
    }
    
    // Check if user is administrator
    const storedApiKey = localStorage.getItem('jal_api_key');
    setApiKey(storedApiKey);
    
    if (storedApiKey === '29e2bb1d4ae031ed47b6') {
      setIsAdmin(true);
    }
    
    // Check if user is staff member (any API key other than admin)
    if (storedApiKey && storedApiKey !== '29e2bb1d4ae031ed47b6') {
      setIsStaff(true);
    }
    
    // Theme is now handled by ThemeContext
    
    // Fetch current event data
    fetchCurrentEvent();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchCurrentEvent();
    }, 30000);
    setRefreshInterval(interval);
    
    setIsLoading(false);
    
    // Cleanup interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);


  // Fetch current event from database
  const fetchCurrentEvent = async () => {
    try {
      setEventLoading(true);
      const response = await fetch(`/api/events?t=${Date.now()}`, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.events.length > 0) {
        const event = data.events[0]; // Get the first (most recent) event
        setCurrentEvent({
          id: event.id,
          name: event.name,
          subtitle: event.airline || 'Aviation Event', // Use airline or default
          description: event.description || '',
          departure: event.departure || event.origin || '',
          arrival: event.arrival || event.destination || '',
          date: new Date(event.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          time: event.time || event.eobtEta || '',
          picture: event.picture || undefined,
          pilotBriefingUrl: '/briefing/pilot'
        });
      } else {
        // No events in database - set to null to show "Stay tuned" message
        setCurrentEvent(null);
      }
    } catch (err: unknown) {
      console.error('Error fetching current event:', err);
      // Set to null to show "Stay tuned" message when API fails
      setCurrentEvent(null);
    } finally {
      setEventLoading(false);
    }
  };

  const handleBriefingClick = () => {
    if (currentEvent && currentEvent.pilotBriefingUrl) {
      window.open(currentEvent.pilotBriefingUrl, '_blank');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Handle tab changes here
    console.log('Tab changed to:', tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('jal_api_key');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold">JL</span>
            </div>
          </div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={handleLogout} 
        isAdmin={isAdmin} 
        isStaff={isStaff}
      />
      
      <div className="flex-1 bg-gray-700 p-6 flex flex-col h-screen">
        <div className="flex-1">
          {/* Render content based on active tab */}
          {activeTab === 'home' ? (
            <>
              {eventLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : currentEvent ? (
                <>
                  <EventHeader event={currentEvent} />
                  
                  {/* Briefing Cards */}
                  <div className="mb-4">
                    <PilotBriefingCard 
                      briefingUrl={currentEvent.pilotBriefingUrl}
                      onBriefingClick={handleBriefingClick}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-gray-800 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">✈️</div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">Stay Tuned for New Events</h3>
                  <p className="text-gray-400 text-lg">
                    We&apos;re preparing exciting aviation events for you. Check back soon for updates!
                  </p>
                  <div className="mt-6 text-sm text-gray-500">
                    Japan Airlines Virtual • Event Booking Portal
                  </div>
                </div>
              )}
            </>
          ) : activeTab === 'booking' ? (
            <BookSlot 
              pilotId={apiKey || ''} 
              pilotName="Pilot" 
              pilotEmail="pilot@example.com" 
            />
          ) : activeTab === 'my-bookings' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">My Bookings</h2>
                <p className="text-gray-400">View and manage your event bookings</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-center">No bookings found. Book an event to see them here.</p>
              </div>
            </div>
          ) : activeTab === 'staff' && isAdmin ? (
            <StaffManagement adminApiKey="29e2bb1d4ae031ed47b6" />
          ) : activeTab === 'events' && (isAdmin || isStaff) ? (
            <EventManagement adminApiKey="29e2bb1d4ae031ed47b6" />
          ) : (
            <>
              {eventLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : currentEvent ? (
                <>
                  <EventHeader event={currentEvent} />
                  
                  {/* Briefing Cards */}
                  <div className="mb-4">
                    <PilotBriefingCard 
                      briefingUrl={currentEvent.pilotBriefingUrl}
                      onBriefingClick={handleBriefingClick}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-gray-800 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">✈️</div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">Stay Tuned for New Events</h3>
                  <p className="text-gray-400 text-lg">
                    We&apos;re preparing exciting aviation events for you. Check back soon for updates!
                  </p>
                  <div className="mt-6 text-sm text-gray-500">
                    Japan Airlines Virtual • Event Booking Portal
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="flex justify-center items-center py-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}