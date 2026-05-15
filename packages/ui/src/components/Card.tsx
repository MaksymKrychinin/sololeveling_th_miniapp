import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface CardProps {
  children?: React.ReactNode;
  variant?: 'default' | 'glass' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
  id?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', hoverable = false, className, onClick, ...props }, ref) => {
    const baseClass = clsx(
      'rounded-xl overflow-hidden',
      {
        // Variants
        'bg-dark-800 border border-dark-700': variant === 'default',
        'bg-white/10 backdrop-blur-md border border-white/20': variant === 'glass',
        'bg-dark-800 border border-primary-600/50 shadow-lg shadow-primary-600/20':
          variant === 'glow',

        // Padding
        'p-0': padding === 'none',
        'p-3': padding === 'sm',
        'p-4': padding === 'md',
        'p-6': padding === 'lg',

        // Hoverable
        'cursor-pointer': hoverable,
      },
      className
    );

    if (hoverable) {
      return (
        <motion.div
          ref={ref}
          className={baseClass}
          onClick={onClick}
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClass} onClick={onClick} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
