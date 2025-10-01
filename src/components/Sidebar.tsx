'use client';

import React, { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { 
  HomeIcon, 
  CalendarIcon,
  ClipboardListIcon,
  CogIcon,
  AdjustmentsHorizontalIcon,
  FiShield as ShieldCheckIcon,
  FiChevronLeft as ChevronLeftIcon,
  FiChevronRight as ChevronRightIcon
} from './Icons';

interface SidebarItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  staffOnly?: boolean;
  badge?: string | number;
}

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isAdmin?: boolean;
  isStaff?: boolean;
  className?: string;
}

// Memoized sidebar item component for better performance
const SidebarItem = memo<{
  item: SidebarItem;
  isActive: boolean;
  onClick: (id: string) => void;
  index: number;
}>(({ item, isActive, onClick, index }) => {
  const IconComponent = item.icon;
  
  return (
    <div 
      className="relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button 
        onClick={() => onClick(item.id)}
        className={`
          w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-300 
          hover:scale-[1.02] hover:shadow-lg group focus:outline-none focus:ring-2 focus:ring-red-500/50
          ${isActive 
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25 border border-red-400/30' 
            : 'text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-gray-500/30'
          }
        `}
        role="tab"
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
      >
        {/* Icon with enhanced styling */}
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
          ${isActive 
            ? 'bg-white/20 shadow-lg' 
            : 'bg-gray-600/50 group-hover:bg-gray-500/70 group-hover:shadow-md'
          }
        `}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex flex-col ml-3 min-w-0 flex-1">
          <span className="text-sm font-semibold truncate">{item.label}</span>
          <span className="text-xs opacity-70 truncate">{item.description}</span>
        </div>

        {/* Badge */}
        {item.badge && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {item.badge}
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>
    </div>
  );
});

SidebarItem.displayName = 'SidebarItem';

export const Sidebar = memo<SidebarProps>(({ 
  activeTab = 'home', 
  onTabChange, 
  isAdmin = false, 
  isStaff = false,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Define sidebar items
  const sidebarItems = useMemo<SidebarItem[]>(() => [
    {
      id: 'home',
      label: 'Home',
      description: 'Dashboard',
      icon: HomeIcon,
    },
    {
      id: 'booking',
      label: 'Booking',
      description: 'Reserve Slots',
      icon: CalendarIcon,
    },
    {
      id: 'my-bookings',
      label: 'My Bookings',
      description: 'View Reservations',
      icon: ClipboardListIcon,
    },
    {
      id: 'events',
      label: 'Manage Events',
      description: 'Admin Panel',
      icon: CogIcon,
      staffOnly: true,
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Preferences',
      icon: AdjustmentsHorizontalIcon,
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      description: 'System Logs',
      icon: ShieldCheckIcon,
      adminOnly: true,
    },
  ], []);

  // Filter items based on permissions
  const visibleItems = useMemo(() => {
    return sidebarItems.filter(item => {
      if (item.adminOnly && !isAdmin) return false;
      if (item.staffOnly && !isStaff && !isAdmin) return false;
      return true;
    });
  }, [sidebarItems, isAdmin, isStaff]);

  // Memoized click handler
  const handleTabClick = useCallback((tab: string) => {
    onTabChange?.(tab);
  }, [onTabChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const currentIndex = visibleItems.findIndex(item => item.id === activeTab);
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % visibleItems.length;
        handleTabClick(visibleItems[nextIndex].id);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? visibleItems.length - 1 : currentIndex - 1;
        handleTabClick(visibleItems[prevIndex].id);
        break;
      case 'Home':
        event.preventDefault();
        handleTabClick(visibleItems[0].id);
        break;
      case 'End':
        event.preventDefault();
        handleTabClick(visibleItems[visibleItems.length - 1].id);
        break;
    }
  }, [visibleItems, activeTab, handleTabClick]);

  return (
    <div 
      className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        bg-gray-800/95 backdrop-blur-sm border-r border-gray-700/50 
        flex flex-col h-full transition-all duration-300 ease-in-out
        shadow-xl ${className}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header with Logo and Collapse Button */}
      <div className="px-4 py-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div 
              className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105"
              onClick={() => handleTabClick('home')}
              title="Click to return to home page"
            >
              <Image 
                src="/img/jal-logo-dark.png"
                alt="Japan Airlines Logo"
                width={120}
                height={40}
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav 
        className="flex flex-col space-y-2 px-3 py-4 flex-1 overflow-y-auto scrollbar-hide"
        onKeyDown={handleKeyDown}
        role="tablist"
      >
        {visibleItems.map((item, index) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            onClick={handleTabClick}
            index={index}
          />
        ))}
      </nav>

      {/* Footer with user info */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-t border-gray-700/50">
          <div className="text-xs text-gray-400 text-center">
            <div className="font-semibold text-gray-300">JAL Virtual</div>
            <div>Booking System</div>
          </div>
        </div>
      )}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';