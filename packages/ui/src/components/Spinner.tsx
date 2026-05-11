import React from 'react';
import clsx from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizeClass = clsx(
    {
      'w-4 h-4': size === 'sm',
      'w-8 h-8': size === 'md',
      'w-12 h-12': size === 'lg',
    },
    'border-2 border-primary-600 border-t-transparent rounded-full animate-spin',
    className
  );

  return <div className={sizeClass} />;
};
