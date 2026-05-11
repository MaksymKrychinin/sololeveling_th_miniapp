import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', hoverable = false, className, ...props }, ref) => {
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

    const Component = hoverable ? motion.div : 'div';

    const motionProps = hoverable
      ? {
          whileHover: { scale: 1.02, y: -2 },
          transition: { duration: 0.2 },
        }
      : {};

    return (
      <Component ref={ref} className={baseClass} {...motionProps} {...props}>
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
