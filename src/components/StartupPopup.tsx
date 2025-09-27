"use client";

import { ReactNode, useEffect, useState } from 'react';

interface StartupPopupProps {
  jalId?: string;
  onFinish?: () => void;
  children?: ReactNode;
}

export function StartupPopup({ jalId, onFinish, children }: StartupPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            onFinish?.();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-sm font-bold">JL</span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">
            Japan Airlines Virtual
          </h2>
          
          <p className="text-gray-400 mb-4">
            Event Booking Portal
          </p>
          
          {jalId && (
            <p className="text-blue-400 font-mono text-sm mb-6">
              Pilot ID: {jalId}
            </p>
          )}
          
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-gray-500 text-sm">
            Initializing system...
          </p>
        </div>
      </div>
    </div>
  );
}