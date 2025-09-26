'use client';

import React from 'react';
import { 
  HomeIcon, 
  CalendarIcon,
  ClipboardListIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  CogIcon
} from './Icons';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onLogout?: () => void;
  isAdmin?: boolean;
  isStaff?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab = 'home', 
  onTabChange, 
  onLogout, 
  isAdmin = false,
  isStaff = false
}) => {
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="w-16 bg-gray-800 flex flex-col items-center py-6 space-y-6 transition-colors duration-200">
      {/* Logo */}
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
        <div className="w-6 h-6 bg-red-600 rounded-sm flex items-center justify-center relative">
          <div className="absolute inset-0 bg-green-600 rounded-sm" style={{clipPath: 'polygon(0 0, 100% 0, 0 100%)'}}></div>
          <span className="text-white text-xs font-bold relative z-10">IV</span>
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col space-y-4">
        {/* 1. Home Page */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('home')}
            className="p-1"
          >
            <HomeIcon className={`w-6 h-6 ${activeTab === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'} cursor-pointer transition-colors`} />
          </button>
          {activeTab === 'home' && (
            <div className="absolute left-0 top-0 w-1 h-6 bg-white rounded-r"></div>
          )}
        </div>

        {/* 2. Booking */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('booking')}
            className="p-1"
          >
            <CalendarIcon className={`w-6 h-6 ${activeTab === 'booking' ? 'text-white' : 'text-gray-400 hover:text-white'} cursor-pointer transition-colors`} />
          </button>
          {activeTab === 'booking' && (
            <div className="absolute left-0 top-0 w-1 h-6 bg-white rounded-r"></div>
          )}
        </div>

        {/* 3. My Bookings */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('my-bookings')}
            className="p-1"
          >
            <ClipboardListIcon className={`w-6 h-6 ${activeTab === 'my-bookings' ? 'text-white' : 'text-gray-400 hover:text-white'} cursor-pointer transition-colors`} />
          </button>
          {activeTab === 'my-bookings' && (
            <div className="absolute left-0 top-0 w-1 h-6 bg-white rounded-r"></div>
          )}
        </div>

        {/* 4. Manage Staff - Only visible to administrators */}
        {isAdmin && (
          <div className="relative">
            <button 
              onClick={() => handleTabClick('staff')}
              className="p-1"
            >
              <UsersIcon className={`w-6 h-6 ${activeTab === 'staff' ? 'text-white' : 'text-gray-400 hover:text-white'} cursor-pointer transition-colors`} />
            </button>
            {activeTab === 'staff' && (
              <div className="absolute left-0 top-0 w-1 h-6 bg-white rounded-r"></div>
            )}
          </div>
        )}

        {/* 5. Manage Event - Visible to both administrators and staff members */}
        {(isAdmin || isStaff) && (
          <div className="relative">
            <button 
              onClick={() => handleTabClick('events')}
              className="p-1"
            >
              <CogIcon className={`w-6 h-6 ${activeTab === 'events' ? 'text-white' : 'text-gray-400 hover:text-white'} cursor-pointer transition-colors`} />
            </button>
            {activeTab === 'events' && (
              <div className="absolute left-0 top-0 w-1 h-6 bg-white rounded-r"></div>
            )}
          </div>
        )}

      </div>

      {/* Bottom Icons */}
      <div className="mt-auto flex flex-col space-y-4">
        {/* Logout */}
        <button className="p-1" onClick={onLogout} title="Logout">
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
        </button>
      </div>
    </div>
  );
};
