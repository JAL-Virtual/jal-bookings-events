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
  SlotManagement,
  BookSlot,
  UTCClock,
  type Event
} from '../../components';
import { APIClient, isAuthenticated } from '../api';

const mockEvent: Event = {
  id: '1',
  name: 'FIRST FLIGHT',
  subtitle: 'Mega Slot Event',
  description: 'IVAO Lebanon invites you to relive a milestone in Middle Eastern aviation with a nostalgic tribute flight from Beirut to Larnaca, recreating Middle East Airlines\' first commercial journey in 1946. Open to vintage propeller aircraft built before 1970—or any prop aircraft under 250 knots if unavailable—this event celebrates aviation heritage with full ATC coverage, a historic atmosphere, and eligibility for the HQ point, Aviation Celebration Award, and a special giveaway book. Jets are not permitted—this one\'s for the classics.',
  departure: 'OLBA',
  arrival: 'LCLK',
  date: 'September 26',
  time: '1700z - 1900z',
  pilotBriefingUrl: '/briefing/pilot'
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isStaff, setIsStaff] = React.useState(false);
  const [apiKey, setApiKey] = React.useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = React.useState<Event | null>(null);
  const [eventLoading, setEventLoading] = React.useState(true);

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
    
    setIsLoading(false);
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
          subtitle: 'Mega Slot Event', // Default subtitle
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
      }
    } catch (err: any) {
      console.error('Error fetching current event:', err);
      // Fallback to mock event if API fails
      setCurrentEvent(mockEvent);
    } finally {
      setEventLoading(false);
    }
  };

  const handleBriefingClick = () => {
    const event = currentEvent || mockEvent;
    if (event.pilotBriefingUrl) {
      window.open(event.pilotBriefingUrl, '_blank');
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
              <EventHeader event={mockEvent} />
              
              {/* Briefing Cards */}
              <div className="mb-4">
                <PilotBriefingCard 
                  briefingUrl={mockEvent.pilotBriefingUrl}
                  onBriefingClick={handleBriefingClick}
                />
              </div>
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
              ) : (
                <>
                  <EventHeader event={currentEvent || mockEvent} />
                  
                  {/* Briefing Cards */}
                  <div className="mb-4">
                    <PilotBriefingCard 
                      briefingUrl={(currentEvent || mockEvent).pilotBriefingUrl}
                      onBriefingClick={handleBriefingClick}
                    />
                  </div>
                </>
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