'use client';

import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  HomeIcon, 
  CalendarIcon,
  ClipboardListIcon,
  CogIcon,
  AdjustmentsHorizontalIcon,
  FiShield as ShieldCheckIcon,
  FiChevronLeft as ChevronLeftIcon,
  FiChevronRight as ChevronRightIcon,
  FiMenu as Bars3Icon,
  FiX as XMarkIcon
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

interface ResponsiveSidebarProps {
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
  isCollapsed?: boolean;
}>(({ item, isActive, onClick, index, isCollapsed = false }) => {
  const IconComponent = item.icon;
  
  return (
    <div 
      className="relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button 
        onClick={() => onClick(item.id)}
        className={`
          w-full flex items-center ${isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-3'} 
          text-left rounded-xl transition-all duration-300 
          hover:scale-[1.02] hover:shadow-lg group focus:outline-none focus:ring-2 focus:ring-red-500/50
          ${isActive 
            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25 border border-red-400/30' 
            : 'text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent hover:border-gray-500/30'
          }
        `}
        role="tab"
        aria-selected={isActive}
        tabIndex={isActive ? 0 : -1}
        title={isCollapsed ? item.label : undefined}
      >
        {/* Icon with enhanced styling */}
        <div className={`
          flex items-center justify-center ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg transition-all duration-300
          ${isActive 
            ? 'bg-white/20 shadow-lg' 
            : 'bg-gray-600/50 group-hover:bg-gray-500/70 group-hover:shadow-md'
          }
        `}>
          <IconComponent className={isCollapsed ? 'w-4 h-4' : 'w-5 h-5'} />
        </div>

        {/* Content - only show when not collapsed */}
        {!isCollapsed && (
          <>
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
          </>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>
    </div>
  );
});

SidebarItem.displayName = 'SidebarItem';

export const ResponsiveSidebar = memo<ResponsiveSidebarProps>(({ 
  activeTab = 'home', 
  onTabChange, 
  isAdmin = false, 
  isStaff = false,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [onTabChange, isMobile]);

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
      case 'Escape':
        if (isMobile) {
          setIsMobileOpen(false);
        }
        break;
    }
  }, [visibleItems, activeTab, handleTabClick, isMobile]);

  // Mobile overlay click handler
  const handleOverlayClick = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Desktop sidebar
  if (!isMobile) {
    return (
      <div 
        className={`
          ${isCollapsed ? 'w-16' : 'w-72'} 
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
                  width={240}
                  height={80}
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
          className="flex flex-col space-y-2 px-3 py-4 flex-1 overflow-y-auto sidebar-scroll"
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
              isCollapsed={isCollapsed}
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
  }

  // Mobile sidebar
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-700/90 transition-all duration-200"
        aria-label="Open navigation menu"
      >
        <Bars3Icon className="w-6 h-6 text-white" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full w-72 bg-gray-800/95 backdrop-blur-sm border-r border-gray-700/50 
          z-50 transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Mobile Header */}
        <div className="px-4 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <div 
            className="cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105"
            onClick={() => handleTabClick('home')}
            title="Click to return to home page"
          >
            <Image 
              src="/img/jal-logo-dark.png"
              alt="Japan Airlines Logo"
              width={240}
              height={80}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
            aria-label="Close navigation menu"
          >
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Mobile Navigation Items */}
        <nav 
          className="flex flex-col space-y-2 px-3 py-4 flex-1 overflow-y-auto sidebar-scroll"
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
              isCollapsed={false}
            />
          ))}
        </nav>

        {/* Mobile Footer */}
        <div className="px-4 py-3 border-t border-gray-700/50">
          <div className="text-xs text-gray-400 text-center">
            <div className="font-semibold text-gray-300">JAL Virtual</div>
            <div>Booking System</div>
          </div>
        </div>
      </div>
    </>
  );
});

ResponsiveSidebar.displayName = 'ResponsiveSidebar';
