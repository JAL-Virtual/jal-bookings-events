import { ReactNode, useState, useRef, useEffect } from 'react';
import { useOutsideClickHandler } from '../hooks/useOutsideClickHandler';

interface DropdownButtonProps {
  text: string;
  children: ReactNode;
}

export function DropdownButton({ text, children }: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClickHandler(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {text}
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-48">
          <div className="py-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}