'use client';

import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export type StatusType = 'booked' | 'available' | 'cancelled' | 'pending' | 'completed' | 'expired';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  showIcon = true, 
  className = '' 
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'booked':
        return {
          label: 'Booked',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-800 dark:text-blue-200',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: CheckCircleIcon,
          iconColor: 'text-blue-500',
        };
      case 'available':
        return {
          label: 'Available',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-200',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: CheckCircleIcon,
          iconColor: 'text-green-500',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-200',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: XCircleIcon,
          iconColor: 'text-red-500',
        };
      case 'pending':
        return {
          label: 'Pending',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: ClockIcon,
          iconColor: 'text-yellow-500',
        };
      case 'completed':
        return {
          label: 'Completed',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
          textColor: 'text-emerald-800 dark:text-emerald-200',
          borderColor: 'border-emerald-200 dark:border-emerald-800',
          icon: CheckCircleIcon,
          iconColor: 'text-emerald-500',
        };
      case 'expired':
        return {
          label: 'Expired',
          bgColor: 'bg-gray-100 dark:bg-gray-800/50',
          textColor: 'text-gray-800 dark:text-gray-200',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: ExclamationTriangleIcon,
          iconColor: 'text-gray-500',
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-1 text-xs',
          icon: 'h-3 w-3',
          spacing: 'mr-1',
        };
      case 'lg':
        return {
          container: 'px-4 py-2 text-base',
          icon: 'h-5 w-5',
          spacing: 'mr-2',
        };
      default: // md
        return {
          container: 'px-3 py-1.5 text-sm',
          icon: 'h-4 w-4',
          spacing: 'mr-1.5',
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const IconComponent = config.icon;

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses.container}
        ${className}
      `}
    >
      {showIcon && (
        <IconComponent 
          className={`${sizeClasses.icon} ${config.iconColor} ${sizeClasses.spacing}`} 
        />
      )}
      {config.label}
    </span>
  );
};

// Convenience components for common statuses
export const BookedBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="booked" {...props} />
);

export const AvailableBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="available" {...props} />
);

export const CancelledBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="cancelled" {...props} />
);

export const PendingBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="pending" {...props} />
);

export const CompletedBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="completed" {...props} />
);

export const ExpiredBadge: React.FC<Omit<StatusBadgeProps, 'status'>> = (props) => (
  <StatusBadge status="expired" {...props} />
);
