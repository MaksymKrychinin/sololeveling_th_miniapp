import { useAchievements, useUserAchievements } from '@/hooks/useApi';
import { Card, Badge, ProgressBar, Spinner } from '@solo-leveling/ui';
import { motion } from 'framer-motion';

const rarityColors = {
  common: 'default',
  rare: 'primary',
  epic: 'warning',
  legendary: 'danger',
};

const Achievements = () => {
  const { data: achievementsData, isLoading: achievementsLoading } = useAchievements();
  const { data: userAchievementsData, isLoading: userLoading } = useUserAchievements();

  const allAchievements = achievementsData?.data || [];
  const userAchievements = userAchievementsData?.data || [];

  const unlockedCount = userAchievements.filter((a: any) => a.isCompleted).length;

  if (achievementsLoading || userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  // Create a map of user achievements for quick lookup
  const userAchievementMap = new Map(
    userAchievements.map((ua: any) => [ua.achievementId, ua])
  );

  // Merge achievements with user progress
  const achievementsWithProgress = allAchievements.map((achievement: any) => {
    const userAchievement = userAchievementMap.get(achievement.id);
    return {
      ...achievement,
      isCompleted: userAchievement?.isCompleted || false,
      progress: userAchievement?.progress || 0,
      unlockedAt: userAchievement?.unlockedAt,
    };
  });

  // Group by rarity
  const groupedAchievements = {
    legendary: achievementsWithProgress.filter((a: any) => a.rarity === 'legendary'),
    epic: achievementsWithProgress.filter((a: any) => a.rarity === 'epic'),
    rare: achievementsWithProgress.filter((a: any) => a.rarity === 'rare'),
    common: achievementsWithProgress.filter((a: any) => a.rarity === 'common'),
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
              {unlockedCount} of {allAchievements.length} unlocked
            </p>
          </div>
          <Badge variant="primary" size="lg">
            {Math.round((unlockedCount / allAchievements.length) * 100)}%
          </Badge>
        </div>
        <ProgressBar
          value={unlockedCount}
          max={allAchievements.length}
          variant="primary"
          size="lg"
          showPercentage
        />
      </Card>

      {/* Achievement Sections */}
      {Object.entries(groupedAchievements).map(
        ([rarity, achievements]: [string, any]) =>
          achievements.length > 0 && (
            <div key={rarity}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-white capitalize">{rarity} Achievements</h2>
                <Badge variant={rarityColors[rarity as keyof typeof rarityColors]}>
                  {achievements.filter((a: any) => a.isCompleted).length}/{achievements.length}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {achievements.map((achievement: any, index: number) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card
                      padding="md"
                      variant={achievement.isCompleted ? 'glow' : 'default'}
                      className={!achievement.isCompleted ? 'opacity-60' : ''}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`text-5xl ${
                            achievement.isCompleted ? '' : 'grayscale opacity-40'
                          }`}
                        >
                          {achievement.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white">{achievement.title}</h3>
                            <Badge
                              variant={rarityColors[rarity as keyof typeof rarityColors]}
                              size="sm"
                            >
                              {rarity}
                            </Badge>
                            {achievement.isCompleted && (
                              <Badge variant="success" size="sm">
                                ✓ Unlocked
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>

                          {/* Progress */}
                          {!achievement.isCompleted && achievement.progress !== undefined && (
                            <div className="mt-3">
                              <ProgressBar
                                value={achievement.progress}
                                max={100}
                                variant="accent"
                                size="sm"
                                showPercentage
                                label="Progress"
                              />
                            </div>
                          )}

                          {/* Unlocked Date */}
                          {achievement.isCompleted && achievement.unlockedAt && (
                            <p className="text-xs text-gray-500 mt-2">
                              Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )
      )}

      {/* Empty State */}
      {allAchievements.length === 0 && (
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
