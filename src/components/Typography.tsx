'use client';

import React from 'react';

interface HeaderProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  textSize?: string;
  textColor?: string;
  children: React.ReactNode;
}

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export const Header: React.FC<HeaderProps> = ({ 
  level = 1, 
  textSize = "text-3xl", 
  textColor = "text-blue-600 dark:text-white", 
  children 
}) => {
  const Tag = `h${level}` as HeadingTag;

  return (
    <Tag className={`${textSize} font-bold ${textColor}`}>
      {children}
    </Tag>
  );
};

interface MutedTextProps {
  textSize?: string;
  children: React.ReactNode;
}

export const MutedText: React.FC<MutedTextProps> = ({ 
  textSize = "text-md md:text-lg", 
  children 
}) => (
  <p className={`font-normal text-gray-500 dark:text-gray-400 ${textSize}`}>
    {children}
  </p>
);

interface FooterTextProps {
  children: React.ReactNode;
}

export const FooterText: React.FC<FooterTextProps> = ({ children }) => (
  <span className="font-normal text-xs text-gray-400">
    {children}
  </span>
);

interface SubheaderProps extends Omit<HeaderProps, "level"> {
  children: React.ReactNode;
}

export const Subheader: React.FC<SubheaderProps> = ({ 
  textSize = "text-md", 
  textColor = "text-blue-500", 
  children 
}) => (
  <span className={`${textSize} font-medium ${textColor}`}>
    {children}
  </span>
);
