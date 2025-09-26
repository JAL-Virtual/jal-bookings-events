'use client';

import React, { ReactNode } from 'react';

interface FilterCardProps {
  active?: boolean;
  text?: string;
  onClick: () => void;
  quantity?: number;
  title: string;
  icon: ReactNode;
}

export const FilterCard: React.FC<FilterCardProps> = ({
  title,
  icon,
  quantity,
  text,
  active,
  onClick
}) => {
  return (
    <button
      className={`flex flex-col w-60 pl-5 pr-4 py-3 rounded-lg text-left transition-colors duration-200 ${
        active 
          ? "bg-blue-600 text-white" 
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center w-full font-bold text-lg">
        <span>{title}</span>
        <div className="ml-auto text-lg w-6" aria-hidden="true">
          {icon}
        </div>
      </div>
      
      {text && (
        <p className={`w-40 text-xs mt-1 ${
          active 
            ? "text-gray-200" 
            : "text-gray-400"
        }`}>
          {text}
        </p>
      )}

      {quantity !== undefined && (
        <span className={`font-bold text-lg self-end mt-1 ${
          active 
            ? "text-white" 
            : "text-blue-400"
        }`}>
          {quantity}
        </span>
      )}
    </button>
  );
};
