'use client';

import React from 'react';

interface AlertProps {
  title: string;
  content: string;
  icon: React.ReactNode;
  backgroundColors: {
    icon: string;
    title: string;
    content: string;
  };
  contentTextColor: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ 
  title, 
  content, 
  icon, 
  backgroundColors, 
  contentTextColor,
  className = '' 
}) => {
  return (
    <div className={`rounded-lg p-4 border border-orange-500/20 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${backgroundColors.icon}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className={`px-3 py-1 rounded-md text-sm font-semibold text-white mb-2 ${backgroundColors.title}`}>
            {title}
          </div>
          <div className={`px-3 py-2 rounded-md text-sm ${backgroundColors.content} ${contentTextColor}`}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};