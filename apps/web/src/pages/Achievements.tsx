import { useUserAchievements } from '@/hooks/useApi';
import { Card, Badge, ProgressBar, Spinner } from '@solo-leveling/ui';
import { motion } from 'framer-motion';

const rarityColors = {
  common: 'default',
  rare: 'primary',
  epic: 'warning',
  legendary: 'danger',
} as const;

type RarityKey = keyof typeof rarityColors;

const Achievements = () => {
  const { data: achievementsData, isLoading } = useUserAchievements();

  const achievements = achievementsData?.data || [];
  const unlockedCount = achievements.filter((a: any) => a.isCompleted).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Group by rarity
  const groupedAchievements = {
    legendary: achievements.filter((a: any) => a.achievement.rarity === 'legendary'),
    epic: achievements.filter((a: any) => a.achievement.rarity === 'epic'),
    rare: achievements.filter((a: any) => a.achievement.rarity === 'rare'),
    common: achievements.filter((a: any) => a.achievement.rarity === 'common'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-primary-400 mb-2">Achievements</h1>
        <p className="text-gray-400">Track your progress and unlock rewards</p>
      </div>

      {/* Progress Card */}
      <Card variant="glow" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Achievement Progress</h2>
            <p className="text-gray-400">
              {unlockedCount} of {achievements.length} unlocked
            </p>
          </div>
          <Badge variant="primary" size="lg">
            {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
          </Badge>
        </div>
        <ProgressBar
          value={unlockedCount}
          max={achievements.length}
          variant="primary"
          size="lg"
          showPercentage
        />
      </Card>

      {/* Achievement Sections */}
      {Object.entries(groupedAchievements).map(
        ([rarity, rarityAchievements]: [string, any]) =>
          rarityAchievements.length > 0 && (
            <div key={rarity}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-white capitalize">{rarity} Achievements</h2>
                <Badge variant={rarityColors[rarity as RarityKey]}>
                  {rarityAchievements.filter((a: any) => a.isCompleted).length}/{rarityAchievements.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {rarityAchievements.map((item: any, index: number) => {
                  const achievement = item.achievement;
                  const requirement = achievement.requirement as any;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card
                        padding="md"
                        variant={item.isCompleted ? 'glow' : 'default'}
                        className={!item.isCompleted ? 'opacity-60' : ''}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`text-5xl ${
                              item.isCompleted ? '' : 'grayscale opacity-40'
                            }`}
                          >
                            {achievement.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-bold text-white">{achievement.title}</h3>
                              <Badge
                                variant={rarityColors[rarity as RarityKey]}
                                size="sm"
                              >
                                {rarity}
                              </Badge>
                              {item.isCompleted && (
                                <Badge variant="success" size="sm">
                                  ✓ Unlocked
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>

                            {/* Requirement Info */}
                            <p className="text-xs text-gray-500 mb-3">
                              Required: {requirement.type.replace('_', ' ')} - {requirement.value}
                            </p>

                            {/* Progress */}
                            {!item.isCompleted && (
                              <div className="mt-3">
                                <ProgressBar
                                  value={item.progress}
                                  max={100}
                                  variant="accent"
                                  size="sm"
                                  showPercentage
                                  label="Progress"
                                />
                              </div>
                            )}

                            {/* Rewards */}
                            {achievement.reward && (
                              <div className="mt-3 flex items-center gap-2 text-xs">
                                <span className="text-gray-400">Rewards:</span>
                                {achievement.reward.xp && (
                                  <Badge variant="primary" size="sm">
                                    +{achievement.reward.xp} XP
                                  </Badge>
                                )}
                                {achievement.reward.title && (
                                  <Badge variant="warning" size="sm">
                                    Title: {achievement.reward.title}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Unlocked Date */}
                            {item.isCompleted && item.unlockedAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Unlocked on {new Date(item.unlockedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )
      )}

      {/* Empty State */}
      {achievements.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🏆</span>
            <h3 className="text-xl font-bold text-white mb-2">No achievements yet</h3>
            <p className="text-gray-400">Complete quests to start unlocking achievements!</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Achievements;
