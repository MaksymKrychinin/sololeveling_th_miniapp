import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LevelUpAnimationProps {
  isOpen: boolean;
  newLevel: number;
  newTitle: string;
  onClose: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  isOpen,
  newLevel,
  newTitle,
  onClose,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowContent(false);
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Animation Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            {/* Particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos((i / 20) * Math.PI * 2) * 200,
                  y: Math.sin((i / 20) * Math.PI * 2) * 200,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  ease: 'easeOut',
                  delay: i * 0.05,
                }}
              />
            ))}

            {/* Main Content */}
            <motion.div
              className="relative text-center pointer-events-auto"
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0, rotateY: 180 }}
              transition={{ duration: 0.6, type: 'spring' }}
            >
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-primary-600 rounded-full blur-3xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Content */}
              <div className="relative bg-dark-800/90 backdrop-blur-md border-2 border-primary-600 rounded-2xl p-12 shadow-2xl">
                <AnimatePresence mode="wait">
                  {showContent ? (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Level Up Text */}
                      <motion.div
                        className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 mb-4 font-display"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        LEVEL UP!
                      </motion.div>

                      {/* Level Number */}
                      <motion.div
                        className="flex items-center justify-center gap-6 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg shadow-primary-600/50">
                          {newLevel}
                        </div>
                      </motion.div>

                      {/* New Title */}
                      <motion.div
                        className="text-3xl font-bold text-white mb-2 font-display"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        {newTitle}
                      </motion.div>

                      <motion.p
                        className="text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        You have grown stronger!
                      </motion.p>

                      {/* Stars */}
                      <motion.div
                        className="flex items-center justify-center gap-2 mt-6"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            className="text-3xl"
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                          >
                            ⭐
                          </motion.span>
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loading"
                      className="text-6xl"
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      ⚡
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
