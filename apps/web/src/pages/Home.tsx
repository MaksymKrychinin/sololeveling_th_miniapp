import { useState } from 'react';
import { useQuests, useCompleteQuest } from '@/hooks/useApi';
import { useUserStore } from '@/store/userStore';
import { Card, Button, ProgressBar, Badge, Spinner, useToast } from '@solo-leveling/ui';
import { useHapticFeedback } from '@solo-leveling/telegram-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelUpAnimation } from '@/components/animations';

const Home = () => {
  const { user } = useUserStore();
  const { data: questsData, isLoading } = useQuests(true);
  const completeQuest = useCompleteQuest();
  const { addToast } = useToast();
  const { impact, notification } = useHapticFeedback();

  const [levelUpData, setLevelUpData] = useState<{
    show: boolean;
    newLevel: number;
    newTitle: string;
  }>({ show: false, newLevel: 0, newTitle: '' });

  const quests = questsData?.data || [];
  const todayQuests = quests.filter((q: any) => q.frequency === 'daily');
  const completedToday = todayQuests.filter((q: any) => q.status === 'completed');

  const handleCompleteQuest = async (questId: string, questTitle: string) => {
    try {
      impact('medium');
      const response = await completeQuest.mutateAsync(questId);
      notification('success');

      // Check if user leveled up
      if (response?.data?.levelUp) {
        setLevelUpData({
          show: true,
          newLevel: response.data.levelUp.newLevel,
          newTitle: response.data.levelUp.newTitle,
        });
        // Vibrate for level up
        impact('heavy');
      }

      addToast({
        message: `${questTitle} completed! +${response?.data?.xpGained || 0} XP gained`,
        type: 'success',
      });
    } catch (error: any) {
      notification('error');
      addToast({
        message: error.message || 'Failed to complete quest',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-primary-400 mb-2">
          Welcome, {user?.firstName || user?.username}!
        </h1>
        <p className="text-gray-400">Rise through the ranks, Hunter</p>
      </div>

      {/* Level Progress */}
      <Card variant="glow" padding="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.title}</h2>
              <p className="text-gray-400">Level {user?.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total XP</p>
              <p className="text-xl font-mono text-primary-400">{user?.totalXP}</p>
            </div>
          </div>
          <ProgressBar
            value={user?.currentXP || 0}
            max={user?.xpToNextLevel || 100}
            variant="primary"
            size="lg"
            showPercentage
            label="XP to next level"
          />
        </div>
      </Card>

      {/* Daily Progress */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">Today's Progress</h3>
          <Badge variant="primary">
            {completedToday.length}/{todayQuests.length}
          </Badge>
        </div>
        <ProgressBar
          value={completedToday.length}
          max={todayQuests.length}
          variant="accent"
          showPercentage
        />
      </Card>

      {/* Quest List */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Today's Quests</h3>
        {todayQuests.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-gray-400">
              No active quests. Visit the Quest Library to add some!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {todayQuests.map((quest: any) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card padding="md" hoverable>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{quest.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{quest.title}</h4>
                          <Badge
                            variant={
                              quest.difficulty === 'easy'
                                ? 'success'
                                : quest.difficulty === 'medium'
                                ? 'primary'
                                : quest.difficulty === 'hard'
                                ? 'warning'
                                : 'danger'
                            }
                            size="sm"
                          >
                            {quest.difficulty}
                          </Badge>
                        </div>
                        {quest.description && (
                          <p className="text-sm text-gray-400 mb-2">{quest.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            ⚡ +{quest.xpReward} XP
                          </span>
                          {quest.statBonus && (
                            <span className="flex items-center gap-1">
                              📈 +{quest.statBonus.amount} {quest.statBonus.stat}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            🔥 {quest.streak} day streak
                          </span>
                        </div>
                      </div>
                      <Button
                        variant={quest.status === 'completed' ? 'secondary' : 'primary'}
                        disabled={quest.status === 'completed' || completeQuest.isPending}
                        onClick={() => handleCompleteQuest(quest.id, quest.title)}
                        isLoading={completeQuest.isPending}
                      >
                        {quest.status === 'completed' ? '✓ Done' : 'Complete'}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Streak Info */}
      {user && user.streak > 0 && (
        <Card variant="glass" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔥</span>
              <div>
                <h4 className="font-bold text-white">Current Streak</h4>
                <p className="text-sm text-gray-400">Keep it up!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-400">{user.streak}</p>
              <p className="text-sm text-gray-400">days</p>
            </div>
          </div>
        </Card>
      )}

      {/* Level Up Animation */}
      <LevelUpAnimation
        isOpen={levelUpData.show}
        newLevel={levelUpData.newLevel}
        newTitle={levelUpData.newTitle}
        onClose={() => setLevelUpData({ show: false, newLevel: 0, newTitle: '' })}
      />
    </div>
  );
};

export default Home;
