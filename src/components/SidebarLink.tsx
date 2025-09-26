'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarPopover } from './SidebarPopover';

export interface SidebarLinkProps {
  title: string;
  href: string;
  icon: JSX.Element;
  indexLink?: boolean;
  state?: any;
}

export const SidebarLink: React.FC<SidebarLinkProps> = forwardRef<HTMLAnchorElement, SidebarLinkProps>((
  { href, icon, title, state, indexLink = false }, ref
) => {
  const pathname = usePathname();
  const isActive = indexLink ? pathname === href : pathname.startsWith(href);
  
  const activeClasses = "text-white border-b-4 lg:border-b-0 lg:border-l-4 border-white py-3";
  const inactiveClasses = "text-blue-400 dark:text-gray-400";

  return (
    <SidebarPopover text={title} icon={icon}>
      <Link
        href={href}
        className={`block relative ${isActive ? activeClasses : inactiveClasses}`}
        title={title}
        ref={ref}
      >
        <div className="w-min mx-auto relative">
          <div className={isActive ? "lg:-ml-1" : ""}>
            {icon}
          </div>
        </div>
      </Link>
    </SidebarPopover>
  );
});
