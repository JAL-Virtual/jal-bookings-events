import { ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  textSize?: string;
  textColor?: string;
  className?: string;
}

export function Header({ children, textSize = 'text-2xl', textColor = 'text-gray-900 dark:text-white', className = '' }: TypographyProps) {
  return (
    <h1 className={`font-bold ${textSize} ${textColor} ${className}`}>
      {children}
    </h1>
  );
}

export function Subheader({ children, textSize = 'text-lg', textColor = 'text-gray-600 dark:text-gray-400', className = '' }: TypographyProps) {
  return (
    <h2 className={`font-semibold ${textSize} ${textColor} ${className}`}>
      {children}
    </h2>
  );
}

export function MutedText({ children, textSize = 'text-sm', textColor = 'text-gray-500 dark:text-gray-500', className = '' }: TypographyProps) {
  return (
    <p className={`${textSize} ${textColor} ${className}`}>
      {children}
    </p>
  );
}
