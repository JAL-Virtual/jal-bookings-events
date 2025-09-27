import { ReactNode } from 'react';

interface SlotBookButtonProps {
  content: ReactNode;
  onClick?: () => void;
  canBookFlight?: boolean;
  disabled?: boolean;
}

export function SlotBookButton({ content, onClick, canBookFlight = true, disabled = false }: SlotBookButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors text-sm";
  const enabledClasses = canBookFlight 
    ? "bg-blue-600 text-white hover:bg-blue-700" 
    : "bg-gray-400 text-gray-600 cursor-not-allowed";
  const disabledClasses = disabled 
    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
    : "";

  return (
    <button
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
      onClick={onClick}
      disabled={disabled || !canBookFlight}
    >
      {content}
    </button>
  );
}