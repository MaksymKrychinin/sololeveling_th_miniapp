import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'accent' | 'success' | 'warning';
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'primary',
  animated = true,
  className,
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const containerClass = clsx(
    'w-full rounded-full overflow-hidden',
    {
      'h-1': size === 'sm',
      'h-2': size === 'md',
      'h-3': size === 'lg',
    },
    'bg-dark-700',
    className
  );

  const barClass = clsx('h-full rounded-full transition-all duration-300', {
    'bg-gradient-to-r from-primary-600 to-primary-500': variant === 'primary',
    'bg-gradient-to-r from-accent-600 to-accent-500': variant === 'accent',
    'bg-gradient-to-r from-green-600 to-green-500': variant === 'success',
    'bg-gradient-to-r from-amber-600 to-amber-500': variant === 'warning',
  });

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="font-mono text-gray-400">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className={containerClass}>
        <motion.div
          className={barClass}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.5 : 0, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
