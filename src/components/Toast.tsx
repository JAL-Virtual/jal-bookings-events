'use client';

import React, { useState, useEffect, useCallback } from 'react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-close timer
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  }, [onClose, id]);

  const getToastStyles = () => {
    const baseStyles = "flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform";
    const visibilityStyles = isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";
    
    switch (type) {
      case 'success':
        return `${baseStyles} ${visibilityStyles} bg-green-600 text-white`;
      case 'error':
        return `${baseStyles} ${visibilityStyles} bg-red-600 text-white`;
      case 'warning':
        return `${baseStyles} ${visibilityStyles} bg-yellow-600 text-white`;
      case 'info':
        return `${baseStyles} ${visibilityStyles} bg-blue-600 text-white`;
      default:
        return `${baseStyles} ${visibilityStyles} bg-gray-600 text-white`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center">
        <span className="text-lg mr-3">{getIcon()}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
      >
        ×
      </button>
    </div>
  );
};

// Toast Container Component
export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast,
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, duration?: number) => {
    addToast({ type: 'success', message, duration });
  };

  const showError = (message: string, duration?: number) => {
    addToast({ type: 'error', message, duration });
  };

  const showWarning = (message: string, duration?: number) => {
    addToast({ type: 'warning', message, duration });
  };

  const showInfo = (message: string, duration?: number) => {
    addToast({ type: 'info', message, duration });
  };

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
  };
};