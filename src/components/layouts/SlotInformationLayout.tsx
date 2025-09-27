import { ReactNode } from 'react';

interface SlotInformationLayoutProps {
  header: string;
  description: string | ReactNode;
  image: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

export function SlotInformationLayout({ header, description, image, actions, children }: SlotInformationLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          {image}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {header}
        </h1>
        <div className="text-gray-600 dark:text-gray-400 mb-8">
          {description}
        </div>
        {actions && (
          <div className="mt-6">
            {actions}
          </div>
        )}
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
