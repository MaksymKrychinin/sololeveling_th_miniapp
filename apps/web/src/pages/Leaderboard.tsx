import { useState } from 'react';
import { useLeaderboard } from '@/hooks/useApi';
import { useUserStore } from '@/store/userStore';
import { Card, Badge, Spinner } from '@solo-leveling/ui';
import { useHapticFeedback } from '@solo-leveling/telegram-sdk';
import { motion } from 'framer-motion';

const types = [
  { id: 'level', name: 'Level', icon: '⬆️' },
  { id: 'xp', name: 'Total XP', icon: '⚡' },
  { id: 'streak', name: 'Streak', icon: '🔥' },
];

const Leaderboard = () => {
  const [selectedType, setSelectedType] = useState('level');
  const { user } = useUserStore();
  const { data: leaderboardData, isLoading } = useLeaderboard(selectedType);
  const { impact } = useHapticFeedback();

  const leaderboard = leaderboardData?.data?.leaderboard || [];
  const currentUserPosition = leaderboardData?.data?.currentUserPosition;

  const getMedalEmoji = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return null;
  };

  const getDisplayValue = (item: any, type: string) => {
    switch (type) {
      case 'level':
        return item.level;
      case 'xp':
        return Number(item.totalXP || 0).toLocaleString();
      case 'streak':
        return item.streak;
      default:
        return '-';
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
        <h1 className="text-3xl font-bold font-display text-primary-400 mb-2">Leaderboard</h1>
        <p className="text-gray-400">See how you rank among other hunters</p>
      </div>

      {/* Type Tabs */}
      <div className="flex gap-2">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              setSelectedType(type.id);
              impact('selection');
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              selectedType === type.id
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            <span>{type.icon}</span>
            <span>{type.name}</span>
          </button>
        ))}
      </div>

      {/* Current User Position */}
      {currentUserPosition && (
        <Card variant="glow" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                #{currentUserPosition}
              </div>
              <div>
                <p className="font-bold text-white">Your Position</p>
                <p className="text-sm text-gray-400">Keep climbing!</p>
              </div>
            </div>
            <Badge variant="primary" size="lg">
              Top {Math.round((currentUserPosition / leaderboard.length) * 100)}%
            </Badge>
          </div>
        </Card>
      )}

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-2xl border-4 border-dark-700">
                {leaderboard[1]?.avatar ? (
                  <img
                    src={leaderboard[1].avatar}
                    alt={leaderboard[1].username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">
                    {leaderboard[1]?.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 text-2xl">🥈</div>
            </div>
            <p className="text-sm font-bold text-white text-center truncate w-full">
              {leaderboard[1]?.username}
            </p>
            <p className="text-xs text-gray-400">{leaderboard[1]?.title}</p>
            <Badge variant="primary" size="sm" className="mt-1">
              {getDisplayValue(leaderboard[1], selectedType)}
            </Badge>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center -mt-4"
          >
            <div className="relative mb-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-3xl border-4 border-yellow-500/50 shadow-lg shadow-yellow-500/50">
                {leaderboard[0]?.avatar ? (
                  <img
                    src={leaderboard[0].avatar}
                    alt={leaderboard[0].username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">
                    {leaderboard[0]?.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 text-3xl">🥇</div>
            </div>
            <p className="text-base font-bold text-white text-center truncate w-full">
              {leaderboard[0]?.username}
            </p>
            <p className="text-xs text-gray-400">{leaderboard[0]?.title}</p>
            <Badge variant="warning" size="sm" className="mt-1">
              {getDisplayValue(leaderboard[0], selectedType)}
            </Badge>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-2xl border-4 border-dark-700">
                {leaderboard[2]?.avatar ? (
                  <img
                    src={leaderboard[2].avatar}
                    alt={leaderboard[2].username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold">
                    {leaderboard[2]?.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 text-2xl">🥉</div>
            </div>
            <p className="text-sm font-bold text-white text-center truncate w-full">
              {leaderboard[2]?.username}
            </p>
            <p className="text-xs text-gray-400">{leaderboard[2]?.title}</p>
            <Badge variant="primary" size="sm" className="mt-1">
              {getDisplayValue(leaderboard[2], selectedType)}
            </Badge>
          </motion.div>
        </div>
      )}

      {/* Full Leaderboard List */}
      <div className="space-y-2">
        {leaderboard.slice(3).map((item: any, index: number) => {
          const position = index + 4;
          const isCurrentUser = user?.id === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Card
                padding="md"
                variant={isCurrentUser ? 'glow' : 'default'}
                className={isCurrentUser ? 'border-2 border-primary-600' : ''}
              >
                <div className="flex items-center gap-4">
                  {/* Position */}
                  <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-white font-bold">
                    #{position}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-xl font-bold text-white">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{item.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-bold text-white">
                      {item.username}
                      {isCurrentUser && <span className="ml-2 text-primary-400">(You)</span>}
                    </p>
                    <p className="text-sm text-gray-400">{item.title}</p>
                  </div>

                  {/* Value */}
                  <Badge variant="primary" size="lg">
                    {getDisplayValue(item, selectedType)}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {leaderboard.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🏆</span>
            <h3 className="text-xl font-bold text-white mb-2">No rankings yet</h3>
            <p className="text-gray-400">Be the first to start your journey!</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Leaderboard;
