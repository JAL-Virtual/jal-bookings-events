"use client";

import { ReactNode } from 'react';

interface StartupPopupProps {
  children?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function StartupPopup({ children, isOpen = false, onClose }: StartupPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome to JAL Event Booking
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          {children || (
            <p>
              Welcome to the Japan Airlines Virtual Event Booking Portal. 
              Here you can book premium aviation events and experiences.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}