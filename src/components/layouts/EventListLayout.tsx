import { ReactNode } from 'react';

interface EventListLayoutProps {
  children: ReactNode;
}

export function EventListLayout({ children }: EventListLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
