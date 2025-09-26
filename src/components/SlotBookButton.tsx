'use client';

import React from 'react';

type HtmlButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

interface SlotBookButtonProps extends Omit<HtmlButtonProps, "className"> {
  canBookFlight?: boolean;
  content: string;
}

export const SlotBookButton: React.FC<SlotBookButtonProps> = ({ 
  content, 
  canBookFlight = true, 
  ...htmlButtonProps 
}) => {
  const background = canBookFlight 
    ? "bg-green-600 text-white hover:bg-green-700" 
    : "bg-red-600/10 text-red-400 cursor-not-allowed";

  return (
    <button
      className={`block ${background} rounded-md w-24 h-9 transition-colors duration-200 ${
        canBookFlight ? "hover:shadow-lg" : ""
      }`}
      disabled={!canBookFlight}
      {...htmlButtonProps}
    >
      <span className="block text-center font-bold truncate text-sm">
        {content}
      </span>
    </button>
  );
};
