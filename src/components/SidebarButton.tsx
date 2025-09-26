'use client';

import React, { forwardRef, MouseEventHandler } from 'react';
import { SidebarLinkProps } from './SidebarLink';
import { SidebarPopover } from './SidebarPopover';

export interface SidebarButtonProps extends Omit<SidebarLinkProps, "href"> {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const SidebarButton: React.FC<SidebarButtonProps> = forwardRef<HTMLButtonElement, SidebarButtonProps>((
  { icon, title, onClick }, ref
) => (
  <SidebarPopover text={title} icon={icon}>
    <button
      className="block text-blue-400 dark:text-gray-400 w-full hover:text-white dark:hover:text-white transition-colors"
      title={title}
      onClick={onClick}
      ref={ref}
    >
      <div className="w-min mx-auto">
        {icon}
      </div>
    </button>
  </SidebarPopover>
));

SidebarButton.displayName = 'SidebarButton';