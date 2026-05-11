import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const contentClass = clsx(
    'relative rounded-xl shadow-2xl',
    'bg-dark-800',
    'border-2 border-dark-700',
    'w-full',
    'max-h-[85vh] flex flex-col',
    {
      'max-w-sm': size === 'sm',
      'max-w-md': size === 'md',
      'max-w-2xl': size === 'lg',
      'max-w-4xl': size === 'xl',
    }
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with higher z-index */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
          >
            <motion.div
              className={contentClass}
              style={{ maxHeight: '90vh', padding: '12px 4px' }}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.3,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between border-b-2 border-dark-700 px-5 py-4 flex-shrink-0 bg-dark-800/95">
                  {title && (
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 font-display">
                      {title}
                    </h3>
                  )}
                  {showCloseButton && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="ml-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-all"
                      aria-label="Close modal"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Content - Scrollable with custom scrollbar */}
              <div className="overflow-y-auto flex-1 bg-dark-800 scrollbar-thin scrollbar-thumb-dark-600 scrollbar-track-dark-800">
                <div className="p-5">{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
