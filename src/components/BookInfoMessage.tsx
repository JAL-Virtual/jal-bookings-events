import { ReactNode } from 'react';

interface BookInfoMessageProps {
  header: string;
  description: string;
  type: 'error' | 'warning' | 'success';
  onErrorReset?: () => void;
}

export function BookInfoMessage({ header, description, type, onErrorReset }: BookInfoMessageProps) {
  const typeClasses = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className={`border rounded-lg p-6 ${typeClasses[type]}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            {header}
          </h3>
          <p className="text-sm mb-4">
            {description}
          </p>
          {onErrorReset && (
            <button
              onClick={onErrorReset}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}