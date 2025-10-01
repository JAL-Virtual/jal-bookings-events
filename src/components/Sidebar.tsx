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
    <div className="w-64 bg-gray-800 flex flex-col h-full transition-all duration-200 overflow-hidden">
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
            style={{ width: '220px', height: '220px', objectFit: 'contain' }}
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-3 px-4 -mt-12 flex-1">
        {/* 1. Home Page - Visible to everyone */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('home')}
            className={`w-full flex items-center px-5 py-4 text-left rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
              activeTab === 'home' 
                ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/30 border-2 border-red-400/30' 
                : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/80 hover:to-gray-600/80 border-2 border-transparent hover:border-gray-500/30'
            }`}
          >
            <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
              activeTab === 'home' 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-gray-600/50 group-hover:bg-gray-500/70 group-hover:shadow-md'
            }`}>
              <HomeIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide">Home</span>
              <span className="text-xs opacity-70">Dashboard</span>
            </div>
            {activeTab === 'home' && (
              <div className="ml-auto flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        </div>

        {/* 2. Booking - Visible to everyone */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('booking')}
            className={`w-full flex items-center px-5 py-4 text-left rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
              activeTab === 'booking' 
                ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/30 border-2 border-red-400/30' 
                : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/80 hover:to-gray-600/80 border-2 border-transparent hover:border-gray-500/30'
            }`}
          >
            <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
              activeTab === 'booking' 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-gray-600/50 group-hover:bg-gray-500/70 group-hover:shadow-md'
            }`}>
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide">Booking</span>
              <span className="text-xs opacity-70">Reserve Slots</span>
            </div>
            {activeTab === 'booking' && (
              <div className="ml-auto flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        </div>

        {/* 3. My Bookings - Visible to everyone */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('my-bookings')}
            className={`w-full flex items-center px-5 py-4 text-left rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
              activeTab === 'my-bookings' 
                ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/30 border-2 border-red-400/30' 
                : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/80 hover:to-gray-600/80 border-2 border-transparent hover:border-gray-500/30'
            }`}
          >
            <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
              activeTab === 'my-bookings' 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-gray-600/50 group-hover:bg-gray-500/70 group-hover:shadow-md'
            }`}>
              <ClipboardListIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide">My Bookings</span>
              <span className="text-xs opacity-70">View Reservations</span>
            </div>
            {activeTab === 'my-bookings' && (
              <div className="ml-auto flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        </div>

        {/* 4. Manage Events - Visible to staff and administrators only */}
        {(isStaff || isAdmin) && (
          <div className="relative">
            <button 
              onClick={() => handleTabClick('events')}
              className={`w-full flex items-center px-5 py-4 text-left rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
                activeTab === 'events' 
                  ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/30 border-2 border-red-400/30' 
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/80 hover:to-gray-600/80 border-2 border-transparent hover:border-gray-500/30'
              }`}
            >
              <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
                activeTab === 'events' 
                  ? 'bg-white/20 shadow-lg' 
                  : 'bg-gray-600/50 group-hover:bg-gray-500/70 group-hover:shadow-md'
              }`}>
                <CogIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide">Manage Events</span>
                <span className="text-xs opacity-70">Admin Panel</span>
              </div>
              {activeTab === 'events' && (
                <div className="ml-auto flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          </div>
        )}

        {/* 5. Settings - Visible to everyone */}
        <div className="relative">
          <button 
            onClick={() => handleTabClick('settings')}
            className={`w-full flex items-center px-5 py-4 text-left rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/30 border-2 border-red-400/30' 
                : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/80 hover:to-gray-600/80 border-2 border-transparent hover:border-gray-500/30'
            }`}
          >
            <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
              activeTab === 'settings' 
                ? 'bg-white/20 shadow-lg' 
                : 'bg-gray-600/50 group-hover:bg-gray-500/70 group-hover:shadow-md'
            }`}>
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wide">Settings</span>
              <span className="text-xs opacity-70">Preferences</span>
            </div>
            {activeTab === 'settings' && (
              <div className="ml-auto flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            )}
          </button>
        </div>

        {/* 6. Audit Logs - Only visible to administrators */}
        {isAdmin && (
          <div className="relative">
            <button 
              onClick={() => handleTabClick('audit-logs')}
              className={`w-full flex items-center px-5 py-4 text-left rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
                activeTab === 'audit-logs' 
                  ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white shadow-xl shadow-red-500/30 border-2 border-red-400/30' 
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/80 hover:to-gray-600/80 border-2 border-transparent hover:border-gray-500/30'
              }`}
            >
              <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
                activeTab === 'audit-logs' 
                  ? 'bg-white/20 shadow-lg' 
                  : 'bg-gray-600/50 group-hover:bg-gray-500/70 group-hover:shadow-md'
              }`}>
                <ClipboardListIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide">Audit Logs</span>
                <span className="text-xs opacity-70">System Logs</span>
              </div>
              {activeTab === 'audit-logs' && (
                <div className="ml-auto flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
