import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const baseClass = clsx(
    'inline-flex items-center justify-center rounded-full font-medium',
    {
      // Variants
      'bg-dark-700 text-gray-300': variant === 'default',
      'bg-primary-600/20 text-primary-400 border border-primary-600/30': variant === 'primary',
      'bg-green-600/20 text-green-400 border border-green-600/30': variant === 'success',
      'bg-amber-600/20 text-amber-400 border border-amber-600/30': variant === 'warning',
      'bg-red-600/20 text-red-400 border border-red-600/30': variant === 'danger',

      // Sizes
      'px-2 py-0.5 text-xs': size === 'sm',
      'px-3 py-1 text-sm': size === 'md',
      'px-4 py-1.5 text-base': size === 'lg',
    },
    className
  );

  return <span className={baseClass}>{children}</span>;
};
