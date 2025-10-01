'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  ResponsiveSidebar, 
  EventHeader, 
  PilotBriefingCard, 
  Footer,
  EventCard,
  UTCClock,
  LoginPopup,
  ToastContainer,
  useToast,
  AuditLogs,
  PageTransition,
  StaggeredTransition
} from '../../components';

import { Event } from '../../types/Event';
import { useEvents } from '../../hooks/event/useEventList';
import { useAuthData } from '../../hooks/useAuthData';
import { useUserInfo } from '../../hooks/useUserInfo';
import { useText } from '../../hooks/useText';

// Optimized loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-green-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
    </div>
  </div>
);

const LoadingCard = () => (
  <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      <div className="h-8 bg-gray-700 rounded w-1/4"></div>
    </div>
  </div>
);


// Dynamically import heavy components with optimized loading
const EventManagement = dynamic(() => import('../../components/EventManagement').then(mod => ({ default: mod.EventManagement })), {
  loading: () => <LoadingCard />,
  ssr: false
});

const BookSlot = dynamic(() => import('../../components/BookSlot').then(mod => ({ default: mod.BookSlot })), {
  loading: () => <LoadingCard />,
  ssr: false
});

const Settings = dynamic(() => import('../../components/Settings').then(mod => ({ default: mod.Settings })), {
  loading: () => <LoadingCard />,
  ssr: false
});



export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [vaId, setVaId] = useState<string>('');
  const [showVaIdModal, setShowVaIdModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  // Toast notifications
  const { toasts, showSuccess, showError, removeToast } = useToast();
  
  // Use the new hooks
  const { data: authData } = useAuthData();
  const { userInfo } = useUserInfo();
  const { data: eventsData, isLoading: eventsLoading } = useEvents();
  const { t } = useText();

  // Memoize expensive computations
  const allEvents = useMemo(() => {
    return eventsData?.pages?.flatMap(page => page.data) || [];
  }, [eventsData]);

  const currentEventData = useMemo(() => {
    return allEvents.find(event => event.status === 'ACTIVE') || allEvents[0] || null;
  }, [allEvents]);

  useEffect(() => {
    // Get stored VA ID
    const storedVaId = localStorage.getItem('jal_va_id');
    if (storedVaId) {
      setVaId(storedVaId);
    } else {
      // Show VA ID modal if not set
      setShowVaIdModal(true);
    }
    
    // Get stored API key for admin/staff access
    const storedApiKey = localStorage.getItem('jal_api_key');
    const storedStaffKey = localStorage.getItem('jal_staff_key');
    setApiKey(storedApiKey);
    
    // Check user roles based on API keys
    if (storedApiKey === '29e2bb1d4ae031ed47b6') {
      setIsAdmin(true);
    }
    
    // Validate staff key against hardcoded key
    if (storedStaffKey === 'AJE(@UE*@DA@ES!$@#W') {
      setIsStaff(true);
    }
    
    setIsLoading(false);
  }, []);

  // Update current event when events data changes
  useEffect(() => {
    if (currentEventData) {
      setCurrentEvent(currentEventData);
      setEventLoading(false);
    } else if (!eventsLoading) {
      setCurrentEvent(null);
      setEventLoading(false);
    }
  }, [currentEventData, eventsLoading]);



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

  const handleVaIdSave = () => {
    if (vaId.trim()) {
      localStorage.setItem('jal_va_id', vaId.trim());
      setShowVaIdModal(false);
      showSuccess('Virtual Airline ID saved successfully!', 2000);
    }
  };

  const handleVaIdChange = (value: string) => {
    // Format as XXX 0000
    const formatted = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (formatted.length <= 7) {
      if (formatted.length > 3) {
        setVaId(formatted.slice(0, 3) + ' ' + formatted.slice (3));
      } else {
        setVaId(formatted);
      }
    }
  };


  // Validate staff key against hardcoded key
  const handleLogin = async (key: string, type: 'admin' | 'staff') => {
    if (type === 'admin') {
      if (key === '29e2bb1d4ae031ed47b6') {
        localStorage.setItem('jal_api_key', key);
        setIsAdmin(true);
        setApiKey(key);
        showSuccess('Administrator login successful!', 3000);
      } else {
        showError('Invalid administrator key. Please try again.', 4000);
      }
    } else if (type === 'staff') {
      // Use hardcoded staff key
      const validStaffKey = 'AJE(@UE*@DA@ES!$@#W';
      
      if (key === validStaffKey) {
        localStorage.setItem('jal_staff_key', key);
        setIsStaff(true);
        showSuccess('Staff login successful!', 3000);
      } else {
        showError('Invalid staff key. Please use: AJE(@UE*@DA@ES!$@#W', 4000);
      }
    }
  };

  const handleLogout = () => {
    // Clear all stored keys
    localStorage.removeItem('jal_api_key');
    localStorage.removeItem('jal_staff_key');
    
    // Reset states
    setIsAdmin(false);
    setIsStaff(false);
    setApiKey(null);
    
    // Show logout success message
    showSuccess('Logged out successfully!', 2000);
  };

  // Redirect to login if not authenticated
  if (isLoading) {
    return null; // Don't show anything while checking authentication
  }

  return (
    <PageTransition type="fade" className="min-h-screen bg-gray-900 text-white flex">
      <ResponsiveSidebar 
        key={`sidebar-${isAdmin}-${isStaff}`}
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        isAdmin={isAdmin}
        isStaff={isStaff}
      />
      
      <div className="flex-1 bg-gray-700 p-6 flex flex-col h-screen">
        {/* UTC Clock and Welcome Message */}
        <div className="flex justify-between items-center mb-4">
          {/* Welcome Message with Pilot ID */}
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <div className="text-sm text-gray-300">
              Welcome, <span className="text-white font-semibold">{vaId || 'Pilot'}</span>
            </div>
          </div>
          
          {/* UTC Clock and Logout Button */}
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 rounded-lg px-4 py-2">
              <UTCClock />
            </div>
            
            {/* Logout Button - Only show if logged in */}
            {(isAdmin || isStaff) && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                title="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {userInfo ? `Welcome, ${userInfo.username}` : 'Dashboard'}
            </h1>
            <p className="text-gray-400">Virtual Airlines Booking Portal</p>
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
                    <StaggeredTransition className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
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
                    </StaggeredTransition>
                  </>
                ) : (
                  <div className="bg-gray-800 rounded-lg p-12 text-center">
                    <p className="text-gray-400">No events available right now. Check back later!</p>
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
          ) : activeTab === 'settings' ? (
            <Settings />
          ) : activeTab === 'audit-logs' && isAdmin ? (
            <AuditLogs adminApiKey="29e2bb1d4ae031ed47b6" />
          ) : activeTab === 'events' && (isAdmin || isStaff) ? (
            <EventManagement adminApiKey="29e2bb1d4ae031ed47b6" />
          ) : (
            <>
              {eventLoading ? (
                <LoadingSpinner />
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
          <div className="relative">
            <Footer />
            {/* Login Hitbox */}
            <div 
              className="absolute inset-0 cursor-pointer opacity-0 hover:opacity-10 bg-blue-500 rounded transition-opacity"
              onClick={() => setShowLoginPopup(true)}
              title="Click to login as Administrator or Staff"
            />
          </div>
        </div>
      </div>

      {/* VA ID Modal */}
      {showVaIdModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-bold text-white mb-4">Set Virtual Airline ID</h3>
            <p className="text-gray-300 mb-4">
              Please enter your Virtual Airline ID in the format XXX 0000 (e.g., JAL 1234)
            </p>
            
            <div className="mb-6">
              <input
                type="text"
                value={vaId}
                onChange={(e) => handleVaIdChange(e.target.value)}
                placeholder="JAL 1234"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-center text-lg tracking-widest"
                maxLength={8}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleVaIdSave}
                disabled={!vaId.trim() || vaId.length < 6}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={handleLogin}
      />

      {/* Toast Notifications */}
      <ToastContainer 
        toasts={toasts}
        onClose={removeToast}
      />
    </PageTransition>
  );
}