'use client';

import React, { cloneElement, HTMLAttributes, isValidElement, ReactNode, useEffect, useState } from 'react';

export interface SidebarPopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, "className"> {
  text: ReactNode;
  icon: ReactNode;
  children: ReactNode;
}

export const SidebarPopover: React.FC<SidebarPopoverProps> = ({ 
  text, 
  icon, 
  children, 
  ...divProps 
}) => {
  const [isPopoverActive, setIsPopoverActive] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [, setPopperElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleMouseEnter = () => setIsPopoverActive(true);
    const handleMouseLeave = () => setIsPopoverActive(false);

    if (referenceElement) {
      referenceElement.addEventListener('mouseenter', handleMouseEnter);
      referenceElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (referenceElement) {
        referenceElement.removeEventListener('mouseenter', handleMouseEnter);
        referenceElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [referenceElement]);

  if (!isValidElement(children)) {
    throw new Error("A valid React children is required in SidebarPopover element.");
  }

  return (
    <>
      {isPopoverActive && (
        <div
          ref={setPopperElement}
          className="bg-blue-600 dark:bg-gray-800 w-[8.68rem] rounded-md text-white z-50 hidden md:block absolute left-full ml-2 top-1/2 transform -translate-y-1/2"
          {...divProps}
        >
          <div className="relative px-4 py-3 overflow-hidden">
            <span className="text-sm leading-5 font-semibold">
              {text}
            </span>
            <div className="absolute bottom-0 right-0 opacity-10">
              {icon}
            </div>
          </div>
        </div>
      )}

      {cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ref: setReferenceElement,
        ...(children.props as Record<string, unknown>)
      })}
    </>
  );
};
