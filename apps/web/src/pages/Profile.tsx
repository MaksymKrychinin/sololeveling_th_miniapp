import { useProfile, useStats, useUserAchievements } from '../hooks/useApi';
import { useUserStore } from '../store/userStore';
import { Card, Badge, ProgressBar, Spinner } from '@solo-leveling/ui';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useUserStore();
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: statsData, isLoading: statsLoading } = useStats();
  const { data: achievementsData } = useUserAchievements();

  const profile = profileData?.data || user;
  const stats = statsData?.data;
  const achievements = achievementsData?.data || [];

  if (profileLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalStats = profile
    ? profile.stats.strength +
      profile.stats.agility +
      profile.stats.intelligence +
      profile.stats.vitality +
      profile.stats.sense
    : 0;

  const unlockedAchievements = achievements.filter((a: any) => a.isCompleted);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card variant="glow" padding="lg">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{profile?.username?.charAt(0).toUpperCase()}</span>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">
              {profile?.firstName || profile?.username}
            </h1>
            <p className="text-lg text-primary-400 font-display mb-2">{profile?.title}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Level {profile?.level}</span>
              <span>•</span>
              <span>{profile?.totalXP} Total XP</span>
              <span>•</span>
              <span>🔥 {profile?.streak} day streak</span>
            </div>
          </div>

          {/* Level Badge */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary-600/20 border-4 border-primary-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-400">{profile?.level}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Level</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6">
          <ProgressBar
            value={profile?.currentXP || 0}
            max={profile?.xpToNextLevel || 100}
            variant="primary"
            size="lg"
            showPercentage
            label="Progress to next level"
          />
        </div>
      </Card>

      {/* Stats */}
      <Card padding="lg">
        <h2 className="text-2xl font-bold text-white mb-4 font-display">Hunter Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Strength */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark-700 rounded-lg p-4 border border-dark-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">💪 Strength</span>
              <span className="text-2xl font-bold text-white">{profile?.stats.strength}</span>
            </div>
            <ProgressBar
              value={profile?.stats.strength || 0}
              max={100}
              variant="primary"
              size="sm"
              animated={false}
            />
          </motion.div>

          {/* Agility */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark-700 rounded-lg p-4 border border-dark-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">⚡ Agility</span>
              <span className="text-2xl font-bold text-white">{profile?.stats.agility}</span>
            </div>
            <ProgressBar
              value={profile?.stats.agility || 0}
              max={100}
              variant="accent"
              size="sm"
              animated={false}
            />
          </motion.div>

          {/* Intelligence */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark-700 rounded-lg p-4 border border-dark-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">🧠 Intelligence</span>
              <span className="text-2xl font-bold text-white">{profile?.stats.intelligence}</span>
            </div>
            <ProgressBar
              value={profile?.stats.intelligence || 0}
              max={100}
              variant="primary"
              size="sm"
              animated={false}
            />
          </motion.div>

          {/* Vitality */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark-700 rounded-lg p-4 border border-dark-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">❤️ Vitality</span>
              <span className="text-2xl font-bold text-white">{profile?.stats.vitality}</span>
            </div>
            <ProgressBar
              value={profile?.stats.vitality || 0}
              max={100}
              variant="success"
              size="sm"
              animated={false}
            />
          </motion.div>

          {/* Sense */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-dark-700 rounded-lg p-4 border border-dark-600 col-span-2"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">👁️ Sense</span>
              <span className="text-2xl font-bold text-white">{profile?.stats.sense}</span>
            </div>
            <ProgressBar
              value={profile?.stats.sense || 0}
              max={100}
              variant="warning"
              size="sm"
              animated={false}
            />
          </motion.div>
        </div>

        {/* Total Stats */}
        <div className="mt-4 pt-4 border-t border-dark-600">
          <div className="flex items-center justify-between">
            <span className="text-lg text-gray-300">Total Stats</span>
            <span className="text-3xl font-bold text-primary-400">{totalStats}</span>
          </div>
        </div>
      </Card>

      {/* Quest Statistics */}
      {stats && (
        <Card padding="lg">
          <h2 className="text-2xl font-bold text-white mb-4 font-display">Quest Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-400">{stats.totalTasksCompleted}</p>
              <p className="text-sm text-gray-400 mt-1">Total Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-400">{stats.quests?.active || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Active Quests</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{stats.quests?.completed || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Completed</p>
            </div>
          </div>

          {/* Category Stats */}
          {stats.categoryStats && Object.keys(stats.categoryStats).length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-bold text-gray-300">Category Breakdown</h3>
              {Object.entries(stats.categoryStats).map(([category, data]: [string, any]) => (
                <div key={category} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 capitalize w-24">{category}</span>
                  <div className="flex-1">
                    <ProgressBar
                      value={data.completed}
                      max={data.total}
                      variant="accent"
                      size="sm"
                      showPercentage={false}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-16 text-right">
                    {data.completed}/{data.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Streak Info */}
      <Card padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 font-display">Current Streak</h2>
            <p className="text-gray-400">Keep completing quests daily to maintain your streak!</p>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-2">🔥</div>
            <p className="text-4xl font-bold text-primary-400">{profile?.streak}</p>
            <p className="text-sm text-gray-400 mt-1">days</p>
          </div>
        </div>

        {profile && profile.longestStreak > profile.streak && (
          <div className="mt-4 pt-4 border-t border-dark-600 text-center">
            <p className="text-gray-400">
              Longest Streak: <span className="text-white font-bold">{profile.longestStreak}</span>{' '}
              days
            </p>
          </div>
        )}
      </Card>

      {/* Achievements Preview */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white font-display">Achievements</h2>
          <Badge variant="primary">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </div>

        {achievements.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {achievements.slice(0, 8).map((achievement: any) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.1 }}
                  className={`aspect-square rounded-lg flex items-center justify-center text-4xl ${
                    achievement.isCompleted
                      ? 'bg-primary-600/20 border-2 border-primary-600'
                      : 'bg-dark-700 border border-dark-600 opacity-40'
                  }`}
                >
                  {achievement.achievement?.icon || '🏆'}
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400">
              Visit Achievements page to see all
            </p>
          </>
        ) : (
          <p className="text-center text-gray-400 py-8">Complete quests to unlock achievements!</p>
        )}
      </Card>
    </div>
  );
};

export default Profile;
