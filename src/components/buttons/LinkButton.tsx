import { ReactNode, AnchorHTMLAttributes } from 'react';

interface LinkButtonProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'content'> {
  content: ReactNode;
  icon?: ReactNode;
  backgroundColor?: string;
  width?: string;
  height?: string;
  href: string;
}

export function LinkButton({ 
  content, 
  icon, 
  backgroundColor = 'bg-blue-600', 
  width = 'w-auto',
  height = 'h-auto',
  className = '',
  ...props 
}: LinkButtonProps) {
  const baseClasses = `inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${width} ${height} ${backgroundColor} text-white hover:opacity-90`;
  
  return (
    <a 
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {icon && (
        <span className="mr-2">
          {icon}
        </span>
      )}
      {content}
    </a>
  );
}
