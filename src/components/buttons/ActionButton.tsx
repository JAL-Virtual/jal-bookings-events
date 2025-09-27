import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  content: ReactNode;
  icon?: ReactNode;
  backgroundColor?: string;
  backgroundFilled?: boolean;
  width?: string;
  height?: string;
  iconBackgroundColor?: string;
}

export function ActionButton({ 
  content, 
  icon, 
  backgroundColor = 'bg-blue-600', 
  backgroundFilled = true,
  width = 'w-auto',
  height = 'h-auto',
  iconBackgroundColor,
  className = '',
  ...props 
}: ActionButtonProps) {
  const baseClasses = `inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${width} ${height}`;
  const filledClasses = backgroundFilled 
    ? `${backgroundColor} text-white hover:opacity-90` 
    : `border-2 border-gray-300 text-gray-700 hover:bg-gray-50`;
  
  return (
    <button 
      className={`${baseClasses} ${filledClasses} ${className}`}
      {...props}
    >
      {icon && (
        <span className={`mr-2 ${iconBackgroundColor || ''}`}>
          {icon}
        </span>
      )}
      {content}
    </button>
  );
}
