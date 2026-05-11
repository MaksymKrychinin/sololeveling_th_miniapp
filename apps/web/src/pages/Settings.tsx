import { useState } from 'react';
import { Card, Button, Badge, Spinner, useToast } from '@solo-leveling/ui';
import { useUserStore } from '../store/userStore';
import { useProfile, useUpdateProfile, useLogout } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { useHapticFeedback } from '@solo-leveling/telegram-sdk';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, logout: storeLogout } = useUserStore();
  const { data: profileData, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { impact, notification } = useHapticFeedback();

  const profile = profileData?.data || user;

  const [timezone, setTimezone] = useState(profile?.timezone || 'UTC');

  const handleUpdateTimezone = async () => {
    try {
      impact('medium');
      await updateProfile.mutateAsync({ timezone });
      notification('success');
      addToast({
        message: 'Timezone updated successfully',
        type: 'success',
      });
    } catch (error: any) {
      notification('error');
      addToast({
        message: error.message || 'Failed to update timezone',
        type: 'error',
      });
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to log out?')) return;

    try {
      impact('medium');
      await logoutMutation.mutateAsync();
      storeLogout();
      notification('success');
      addToast({
        message: 'Logged out successfully',
        type: 'success',
      });
      navigate('/login');
    } catch (error: any) {
      // Logout locally even if API fails
      storeLogout();
      navigate('/login');
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
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-primary-400 mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card padding="lg">
          <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-dark-700">
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="text-white font-medium">{profile?.username}</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-dark-700">
              <div>
                <p className="text-sm text-gray-400">Display Name</p>
                <p className="text-white font-medium">
                  {profile?.firstName || profile?.username}
                  {profile?.lastName && ` ${profile.lastName}`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-dark-700">
              <div>
                <p className="text-sm text-gray-400">Current Rank</p>
                <p className="text-white font-medium">{profile?.title}</p>
              </div>
              <Badge variant="primary">{profile?.level}</Badge>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-gray-400">Total XP</p>
                <p className="text-white font-medium">{profile?.totalXP}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card padding="lg">
          <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
          
          <div className="space-y-6">
            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timezone
              </label>
              <div className="flex gap-3">
                <select
                  className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="UTC">UTC (GMT+0)</option>
                  <option value="America/New_York">Eastern Time (GMT-5)</option>
                  <option value="America/Chicago">Central Time (GMT-6)</option>
                  <option value="America/Denver">Mountain Time (GMT-7)</option>
                  <option value="America/Los_Angeles">Pacific Time (GMT-8)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="Europe/Paris">Paris (GMT+1)</option>
                  <option value="Europe/Kiev">Kyiv (GMT+2)</option>
                  <option value="Asia/Dubai">Dubai (GMT+4)</option>
                  <option value="Asia/Kolkata">India (GMT+5:30)</option>
                  <option value="Asia/Shanghai">China (GMT+8)</option>
                  <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                  <option value="Australia/Sydney">Sydney (GMT+10)</option>
                </select>
                <Button
                  variant="primary"
                  onClick={handleUpdateTimezone}
                  disabled={timezone === profile?.timezone || updateProfile.isPending}
                  isLoading={updateProfile.isPending}
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Used to reset daily quests at midnight in your timezone
              </p>
            </div>

            {/* Notifications (Placeholder) */}
            <div className="pt-4 border-t border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Telegram Notifications</p>
                  <p className="text-sm text-gray-400">Receive reminders via Telegram Bot</p>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </div>

            {/* Data Export (Placeholder) */}
            <div className="pt-4 border-t border-dark-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Export Data</p>
                  <p className="text-sm text-gray-400">Download your progress and quests</p>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card padding="lg">
          <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-dark-700/50 rounded-lg">
              <p className="text-3xl font-bold text-primary-400">
                {profile?.totalTasksCompleted || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">Quests Completed</p>
            </div>
            <div className="text-center p-4 bg-dark-700/50 rounded-lg">
              <p className="text-3xl font-bold text-accent-400">{profile?.streak || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Day Streak</p>
            </div>
            <div className="text-center p-4 bg-dark-700/50 rounded-lg">
              <p className="text-3xl font-bold text-green-400">{profile?.level || 1}</p>
              <p className="text-sm text-gray-400 mt-1">Current Level</p>
            </div>
            <div className="text-center p-4 bg-dark-700/50 rounded-lg">
              <p className="text-3xl font-bold text-amber-400">
                {profile?.longestStreak || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">Longest Streak</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card padding="lg" className="border-red-900/50">
          <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Log Out</p>
                <p className="text-sm text-gray-400">Sign out from your account</p>
              </div>
              <Button
                variant="danger"
                onClick={handleLogout}
                isLoading={logoutMutation.isPending}
                disabled={logoutMutation.isPending}
              >
                Log Out
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
              <div>
                <p className="font-medium text-white">Delete Account</p>
                <p className="text-sm text-gray-400">Permanently delete your account and data</p>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* App Info */}
      <Card variant="glass" padding="md">
        <div className="text-center text-sm text-gray-400">
          <p>Solo Leveling Habit Tracker</p>
          <p className="mt-1">Version 1.0.0</p>
          <p className="mt-2 text-xs">
            Made with 💜 for hunters who level up daily
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
