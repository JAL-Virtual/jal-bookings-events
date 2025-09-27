import { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;
  header: string;
  content: string;
  iconBackground?: string;
  children?: ReactNode;
}

export function VerticalInfoCard({ icon, header, content, iconBackground = 'bg-blue-600', children }: InfoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${iconBackground} text-white`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {header}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {content}
          </p>
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HorizontalInfoCard({ icon, header, content, iconBackground = 'bg-blue-600' }: InfoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${iconBackground} text-white`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {header}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}