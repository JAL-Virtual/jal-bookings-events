'use client';

import React from 'react';

interface HeaderProps {
  textSize?: string;
  textColor?: string;
  children: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  textSize = 'text-4xl', 
  textColor = 'text-white', 
  children, 
  className = '' 
}) => {
  return (
    <h1 className={`font-bold leading-tight ${textSize} ${textColor} ${className}`}>
      {children}
    </h1>
  );
};

interface SubheaderProps {
  textSize?: string;
  textColor?: string;
  children: React.ReactNode;
  className?: string;
}

export const Subheader: React.FC<SubheaderProps> = ({ 
  textSize = 'text-lg', 
  textColor = 'text-gray-300', 
  children, 
  className = '' 
}) => {
  return (
    <h2 className={`font-semibold leading-relaxed ${textSize} ${textColor} ${className}`}>
      {children}
    </h2>
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