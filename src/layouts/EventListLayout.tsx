import { FunctionComponent, ReactNode } from "react";

interface EventListLayoutProps {
  children: ReactNode;
}

export const EventListLayout: FunctionComponent<EventListLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and join exciting aviation events
          </p>
        </div>
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};
