'use client';

import React from 'react';
import Image from 'next/image';
import { 
  HomeIcon, 
  CalendarIcon,
  ClipboardListIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  CogIcon,
  PlusIcon,
  PlusCircleIcon
} from './Icons';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  isAdmin?: boolean;
  isStaff?: boolean;
  hasBookings?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab = 'home', 
  onTabChange, 
  onLogout, 
  isAdmin = false,
  isStaff = false,
  hasBookings = false
}) => {
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="w-64 bg-gray-800 flex flex-col pt-2 pb-6 space-y-2 transition-all duration-200">
      {/* Logo */}
      <div className="px-6 flex justify-center -mt-40">
        <Image 
          src={`/img/jal-logo-dark-large.png?v=${Date.now()}`}
          alt="Japan Airlines Logo"
          width={400}
          height={400}
          className="object-contain"
          priority
          unoptimized
          style={{
            width: '400px',
            height: '400px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-1 -mt-42">
        {/* 1. Home Page */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('home')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-700 transition-colors ${
              activeTab === 'home' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <HomeIcon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Home</span>
          </button>
          {activeTab === 'home' && (
            <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r"></div>
          )}
        </div>

        {/* 2. Booking */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('booking')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-700 transition-colors ${
              activeTab === 'booking' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Booking</span>
          </button>
          {activeTab === 'booking' && (
            <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r"></div>
          )}
        </div>

        {/* 3. My Bookings */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('my-bookings')}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-700 transition-colors ${
              activeTab === 'my-bookings' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ClipboardListIcon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">My Bookings</span>
          </button>
          {activeTab === 'my-bookings' && (
            <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r"></div>
          )}
        </div>

        {/* 4. Manage Staff - Only visible to administrators */}
        {isAdmin && (
          <div className="relative">
            <button 
              onClick={() => handleTabClick('staff')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-700 transition-colors ${
                activeTab === 'staff' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <UsersIcon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Manage Staff</span>
            </button>
            {activeTab === 'staff' && (
              <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r"></div>
            )}
          </div>
        )}

        {/* 5. Manage Event - Visible to both administrators and staff members */}
        {(isAdmin || isStaff) && (
          <div className="relative">
            <button 
              onClick={() => handleTabClick('events')}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-700 transition-colors ${
                activeTab === 'events' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <CogIcon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Manage Events</span>
            </button>
            {activeTab === 'events' && (
              <div className="absolute left-0 top-0 w-1 h-full bg-white rounded-r"></div>
            )}
            
            {/* Sub-buttons for Manage Events */}
            {(activeTab === 'events' || activeTab === 'add-event' || activeTab === 'add-slot') && (
              <div className="ml-4 mt-1 space-y-1">
                <button 
                  onClick={() => handleTabClick('add-event')}
                  className={`w-full flex items-center px-6 py-2 text-left hover:bg-gray-700 transition-colors rounded-md ${
                    activeTab === 'add-event' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <PlusIcon className="w-4 h-4 mr-3" />
                  <span className="text-xs font-medium">Add Event</span>
                </button>
                <button 
                  onClick={() => handleTabClick('add-slot')}
                  className={`w-full flex items-center px-6 py-2 text-left hover:bg-gray-700 transition-colors rounded-md ${
                    activeTab === 'add-slot' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <PlusCircleIcon className="w-4 h-4 mr-3" />
                  <span className="text-xs font-medium">Add Slot</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Section */}
      <div className="mt-auto">
        {/* Logout */}
        <div className="relative">
          <button 
            className="w-full flex items-center px-6 py-3 text-left hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            onClick={onLogout} 
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
