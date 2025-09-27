'use client';

import React, { useEffect, useState } from 'react';
import { 
  Sidebar, 
  EventHeader, 
  PilotBriefingCard, 
  Footer,
  StaffManagement,
  EventManagement,
  BookSlot,
  LoadingIndicator,
  EventCard,
  ActionButton,
  UTCClock
} from '../../components';
import { Event } from '../../types/Event';
import { isAuthenticated } from '../api/client';
import { useEvents } from '../../hooks/event/useEventList';
import { useAuthData } from '../../hooks/useAuthData';
import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserBookings } from '../../hooks/useUserBookings';
import { useText } from '../../hooks/useText';


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  
  // Use the new hooks
  const { data: authData, isLoading: authLoading } = useAuthData();
  const { userInfo, isLoading: userInfoLoading } = useUserInfo();
  const { data: eventsData, isLoading: eventsLoading, hasNextPage, fetchNextPage } = useEvents();
  const { hasBookings, isLoading: bookingsLoading } = useUserBookings(apiKey || undefined);
  const { t } = useText();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/';
      return;
    }
    
    // Get stored API key
    const storedApiKey = localStorage.getItem('jal_api_key');
    setApiKey(storedApiKey);
    
    // Check user roles
    if (storedApiKey === '29e2bb1d4ae031ed47b6') {
      setIsAdmin(true);
    } else if (storedApiKey && storedApiKey !== '29e2bb1d4ae031ed47b6') {
      setIsStaff(true);
    }
    
    setIsLoading(false);
  }, []);

  // Update current event when events data changes
  useEffect(() => {
    if (eventsData?.pages?.[0]?.data && eventsData.pages[0].data.length > 0) {
      const event = eventsData.pages[0].data[0];
      setCurrentEvent(event);
      setEventLoading(false);
    } else if (!eventsLoading) {
      setCurrentEvent(null);
      setEventLoading(false);
    }
  }, [eventsData, eventsLoading]);


  // Get all events for the events list
  const allEvents = eventsData?.pages?.flatMap(page => page.data) || [];

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

  // Redirect to login if not authenticated
  if (isLoading) {
    return null; // Don't show anything while checking authentication
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={handleLogout} 
        isAdmin={isAdmin} 
        isStaff={isStaff}
        hasBookings={hasBookings}
      />
      
      <div className="flex-1 bg-gray-700 p-6 flex flex-col h-screen">
        {/* UTC Clock at the top */}
        <div className="flex justify-end items-center mb-4">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <UTCClock />
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {userInfo ? `Welcome, ${userInfo.username}` : 'Dashboard'}
            </h1>
            <p className="text-gray-400">Japan Airlines Virtual Event Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Render content based on active tab */}
          {activeTab === 'home' ? (
            <div className="space-y-6">
              {/* Current Event Section */}
              {currentEvent && (
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
              )}

              {/* All Events Section */}
              <div className="space-y-6">
                {allEvents.length > 0 ? (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">{t('events.title')}</h2>
                      <p className="text-gray-400">{t('events.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          eventId={event.id}
                          imageSrc={event.banner}
                          eventName={event.eventName}
                          eventType={event.type}
                          description={event.description}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <p className="text-gray-400">No events available right now. Check back later!</p>
                  </div>
                )}
                
                {hasNextPage && (
                  <div className="flex justify-center">
                    <ActionButton 
                      content={t('flights.loadMore')} 
                      backgroundFilled={false}
                      onClick={() => fetchNextPage()}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'booking' ? (
            <BookSlot 
              pilotId={apiKey || ''} 
              pilotName={authData?.firstName || 'Pilot'} 
              pilotEmail={`${authData?.vid || 'pilot'}@jalvirtual.com`} 
            />
          ) : activeTab === 'my-bookings' ? (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <p className="text-gray-400">This tab only work if u book a event</p>
            </div>
          ) : activeTab === 'staff' && isAdmin ? (
            <StaffManagement adminApiKey="29e2bb1d4ae031ed47b6" />
          ) : activeTab === 'events' && (isAdmin || isStaff) ? (
            <EventManagement adminApiKey="29e2bb1d4ae031ed47b6" />
          ) : (
            <>
              {eventLoading ? (
                <div className="flex items-center justify-center h-64">
                  <LoadingIndicator size="lg" />
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
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                    {t('events.title')} - {t('events.subtitle')}
                  </h3>
                  <p className="text-gray-400">No events available right now. Check back later!</p>
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