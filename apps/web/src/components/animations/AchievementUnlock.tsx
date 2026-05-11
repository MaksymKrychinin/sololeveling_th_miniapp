import { motion, AnimatePresence } from 'framer-motion';

interface AchievementUnlockProps {
  isOpen: boolean;
  achievement: {
    icon: string;
    title: string;
    description: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  } | null;
  onClose: () => void;
}

const rarityColors = {
  common: { border: 'border-gray-500', glow: 'shadow-gray-500/50', text: 'text-gray-400' },
  rare: { border: 'border-blue-500', glow: 'shadow-blue-500/50', text: 'text-blue-400' },
  epic: { border: 'border-purple-500', glow: 'shadow-purple-500/50', text: 'text-purple-400' },
  legendary: { border: 'border-yellow-500', glow: 'shadow-yellow-500/50', text: 'text-yellow-400' },
};

export const AchievementUnlock: React.FC<AchievementUnlockProps> = ({
  isOpen,
  achievement,
  onClose,
}) => {
  if (!achievement) return null;

  const colors = rarityColors[achievement.rarity];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              className={`relative bg-dark-800 rounded-2xl p-8 max-w-md w-full border-4 ${colors.border} shadow-2xl ${colors.glow}`}
              initial={{ scale: 0, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0, rotateY: 90 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />

              {/* Content */}
              <div className="relative text-center">
                {/* Header */}
                <motion.p
                  className="text-sm uppercase tracking-wider text-primary-400 mb-4 font-bold"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Achievement Unlocked!
                </motion.p>

                {/* Icon */}
                <motion.div
                  className="text-8xl mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  {achievement.icon}
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="text-3xl font-bold text-white mb-2 font-display"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {achievement.title}
                </motion.h2>

                {/* Rarity */}
                <motion.p
                  className={`text-sm uppercase tracking-wider ${colors.text} mb-4 font-bold`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {achievement.rarity}
                </motion.p>

                {/* Description */}
                <motion.p
                  className="text-gray-400 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {achievement.description}
                </motion.p>

                {/* Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [0, -20],
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.7 + Math.random() * 0.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Awesome!
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
