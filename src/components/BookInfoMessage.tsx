'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BookInfoMessageProps {
  header: string;
  description: string;
  type: 'error' | 'warning' | 'success';
  onErrorReset: () => void;
}

export const BookInfoMessage: React.FC<BookInfoMessageProps> = ({ 
  header, 
  description, 
  type, 
  onErrorReset 
}) => {
  return (
    <div className="max-w-[42rem] mt-11 ml-9">
      <h2 className={`text-2xl font-bold ${
        type === 'error' 
          ? 'text-red-400' 
          : type === 'warning'
          ? 'text-yellow-400'
          : 'text-green-400'
      }`}>
        {header}
      </h2>
      
      <p className="mt-4 text-[20px] text-gray-400 leading-relaxed">
        {description}
      </p>
      
      <div className="mt-16">
        <button
          onClick={onErrorReset}
          className="w-72 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>
    </div>
  );
};
