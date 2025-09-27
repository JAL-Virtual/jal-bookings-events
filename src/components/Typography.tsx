'use client';

import React from 'react';

interface HeaderProps {
  textSize?: string;
  children: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ textSize = 'text-4xl', children, className = '' }) => {
  return (
    <h1 className={`font-bold text-white leading-tight ${textSize} ${className}`}>
      {children}
    </h1>
  );
};

interface MutedTextProps {
  children: React.ReactNode;
  className?: string;
}

export const MutedText: React.FC<MutedTextProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-gray-300 text-lg leading-relaxed ${className}`}>
      {children}
    </p>
  );
};