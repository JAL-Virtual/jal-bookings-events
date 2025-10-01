'use client';

import React from 'react';
import Image from 'next/image';
import { 
  HomeIcon, 
  CalendarIcon,
  ClipboardListIcon,
  CogIcon,
  AdjustmentsHorizontalIcon
} from './Icons';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isAdmin?: boolean;
  isStaff?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab = 'home', 
  onTabChange, 
  isAdmin = false, 
  isStaff = false 
}) => {
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="w-64 bg-gray-800 flex flex-col h-full transition-all duration-200">
      {/* Logo */}
      <div className="px-6 pt-2 pb-1 -mt-12 flex justify-center">
        <div 
          className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105"
          onClick={() => handleTabClick('home')}
          title="Click to return to home page"
        >
          <Image 
            src="/img/jal-logo-dark-large.png"
            alt="Japan Airlines Logo"
            width={220}
            height={220}
            className="object-contain"
            priority
            unoptimized
            style={{
              width: '220px',
              height: '220px',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-1 px-2 pt-1 flex-1">
        {/* 1. Home Page - Visible to everyone */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('home')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg mx-2 hover:bg-gray-700 transition-all duration-200 ${
              activeTab === 'home' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <HomeIcon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">Home</span>
          </button>
          {activeTab === 'home' && (
            <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r"></div>
          )}
        </div>

        {/* 2. Booking - Visible to everyone */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('booking')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg mx-2 hover:bg-gray-700 transition-all duration-200 ${
              activeTab === 'booking' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">Booking</span>
          </button>
          {activeTab === 'booking' && (
            <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r"></div>
          )}
        </div>

        {/* 3. My Bookings - Visible to everyone */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('my-bookings')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg mx-2 hover:bg-gray-700 transition-all duration-200 ${
              activeTab === 'my-bookings' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ClipboardListIcon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">My Bookings</span>
          </button>
          {activeTab === 'my-bookings' && (
            <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r"></div>
          )}
        </div>

        {/* 4. Manage Events - Visible to staff and administrators only */}
        {(isStaff || isAdmin) && (
          <div className="relative">
            <button 
              onClick={() => handleTabClick('events')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg mx-2 hover:bg-gray-700 transition-all duration-200 ${
                activeTab === 'events' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <CogIcon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Manage Events</span>
            </button>
            {activeTab === 'events' && (
              <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r"></div>
            )}
          </div>
        )}

        {/* 5. Settings - Visible to everyone */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('settings')}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg mx-2 hover:bg-gray-700 transition-all duration-200 ${
              activeTab === 'settings' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          {activeTab === 'settings' && (
            <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r"></div>
          )}
        </div>

        {/* 6. Audit Logs - Only visible to administrators */}
        {isAdmin && (
          <div className="relative">
            <button 
              onClick={() => handleTabClick('audit-logs')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg mx-2 hover:bg-gray-700 transition-all duration-200 ${
                activeTab === 'audit-logs' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ClipboardListIcon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Audit Logs</span>
            </button>
            {activeTab === 'audit-logs' && (
              <div className="absolute left-0 top-1 bottom-1 w-1 bg-blue-500 rounded-r"></div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
