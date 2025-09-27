"use client";

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingIndicator({ size = 'md', className = '' }: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
    </div>
  );
}