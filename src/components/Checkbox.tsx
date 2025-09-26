'use client';

import React from 'react';

export interface CheckboxProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  value,
  onChange,
}) => {
  return (
    <label className="h-3 w-3 relative block cursor-pointer">
      <input
        type="checkbox"
        className="absolute opacity-0 cursor-pointer h-0 w-0 focus:outline-none"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={`absolute top-0 left-0 h-3 w-3 rounded-sm transition-colors ${
        value 
          ? 'bg-green-600' 
          : 'bg-gray-300 dark:bg-gray-700'
      }`} />
      {value && (
        <span className="absolute left-1 top-0.5 w-0.5 h-1 border-r-2 border-b-2 border-white transform rotate-45" />
      )}
    </label>
  );
};
