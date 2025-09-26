'use client';

import React, { useContext } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { 
  ClipboardDocumentIcon, 
  HomeIcon, 
  InformationCircleIcon, 
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '../contexts/ThemeContext';
import { SidebarLink } from './SidebarLink';
import { SidebarButton } from './SidebarButton';

interface EventSidebarProps {
  visible?: boolean;
}

const ICON_SIZE = 28;

export const EventSidebar: React.FC<EventSidebarProps> = ({ visible = true }) => {
  const params = useParams();
  const pathname = usePathname();
  const { theme, setTheme } = useContext(ThemeContext);

  const eventId = params?.eventId;

  if (eventId === undefined) {
    throw new Error("The event id is undefined");
  }

  return (
    <nav className={`${visible ? "" : "hidden"} flex flex-row lg:flex-col w-full lg:w-28 h-full px-4 lg:px-0 bg-blue-600 dark:bg-gray-800 shadow-2xl overflow-x-auto`}>
      <div className="hidden lg:block mt-7">
        <div className="text-white text-xl font-bold text-center">
          JAL
        </div>
      </div>

      <div className="flex items-center lg:items-stretch flex-row lg:flex-col lg:my-auto gap-8">
        <SidebarLink
          href={`/event/${eventId}`}
          icon={<InformationCircleIcon className="w-7 h-7" />}
          title="Information"
          indexLink />

        <SidebarLink
          href={`/event/${eventId}/slots`}
          icon={<PaperAirplaneIcon className="w-7 h-7" />}
          title="Flights" />

        <SidebarLink
          href={`/event/${eventId}/my-slots`}
          icon={<ClipboardDocumentIcon className="w-7 h-7" />}
          title="My Flights" />

        <SidebarLink
          href={`/events`}
          icon={<HomeIcon className="w-7 h-7" />}
          title="Events Home" />
      </div>
      
      <div className="my-auto lg:my-0 mx-auto lg:mx-0 ml-8 lg:ml-0 lg:mt-auto lg:mb-10">
        <div className="flex items-center lg:items-stretch flex-row lg:flex-col lg:my-auto gap-8">
          <SidebarButton
            icon={theme === 'light' ? <MoonIcon className="w-7 h-7" /> : <SunIcon className="w-7 h-7" />}
            title="Change Theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />

          <SidebarLink
            href={`/logout`}
            icon={<ArrowRightOnRectangleIcon className="w-7 h-7" />}
            title="Logout" />
        </div>
      </div>
    </nav>
  );
};
