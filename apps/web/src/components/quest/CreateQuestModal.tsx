import { useState } from 'react';
import { Modal, Button, Input, Badge, useToast } from '@solo-leveling/ui';
import { useCreateQuest } from '@/hooks/useApi';
import { useHapticFeedback } from '@solo-leveling/telegram-sdk';

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { id: 'hygiene', name: 'Hygiene', icon: '🚿' },
  { id: 'health', name: 'Health', icon: '🥗' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'learning', name: 'Learning', icon: '📚' },
  { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
  { id: 'productivity', name: 'Productivity', icon: '⚡' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'custom', name: 'Custom', icon: '✨' },
];

const difficulties = [
  { id: 'easy', name: 'Easy', color: 'success', xp: 10 },
  { id: 'medium', name: 'Medium', color: 'primary', xp: 20 },
  { id: 'hard', name: 'Hard', color: 'warning', xp: 30 },
  { id: 'legendary', name: 'Legendary', color: 'danger', xp: 50 },
];

const frequencies = [
  { id: 'daily', name: 'Daily' },
  { id: 'weekly', name: 'Weekly' },
  { id: 'custom', name: 'Custom' },
];

const stats = [
  { id: 'strength', name: 'Strength', icon: '💪' },
  { id: 'agility', name: 'Agility', icon: '⚡' },
  { id: 'intelligence', name: 'Intelligence', icon: '🧠' },
  { id: 'vitality', name: 'Vitality', icon: '❤️' },
  { id: 'sense', name: 'Sense', icon: '👁️' },
];

export const CreateQuestModal: React.FC<CreateQuestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'custom',
    difficulty: 'easy',
    frequency: 'daily',
    icon: '⭐',
    xpReward: 10,
    statBonus: { stat: 'strength', amount: 1 },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createQuest = useCreateQuest();
  const { addToast } = useToast();
  const { impact, notification } = useHapticFeedback();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Quest title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.xpReward < 1 || formData.xpReward > 100) {
      newErrors.xpReward = 'XP reward must be between 1 and 100';
    }

    if (formData.statBonus.amount < 1 || formData.statBonus.amount > 10) {
      newErrors.statBonus = 'Stat bonus must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      impact('warning');
      addToast({
        message: 'Please fix the errors in the form',
        type: 'warning',
      });
      return;
    }

    try {
      impact('medium');
      await createQuest.mutateAsync({
        ...formData,
        isActive: true,
      });
      notification('success');
      addToast({
        message: 'Quest created successfully!',
        type: 'success',
      });
      handleClose();
    } catch (error: any) {
      notification('error');
      addToast({
        message: error.message || 'Failed to create quest',
        type: 'error',
      });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'custom',
      difficulty: 'easy',
      frequency: 'daily',
      icon: '⭐',
      xpReward: 10,
      statBonus: { stat: 'strength', amount: 1 },
    });
    setErrors({});
    onClose();
  };

  const handleDifficultyChange = (difficultyId: string) => {
    const difficulty = difficulties.find((d) => d.id === difficultyId);
    if (difficulty) {
      setFormData((prev) => ({
        ...prev,
        difficulty: difficultyId,
        xpReward: difficulty.xp,
      }));
    }
  };

  return (
      <Modal isOpen={isOpen} onClose={handleClose} title="✨ Create Custom Quest" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4" style={{ maxHeight: '80vh' }}>
          {/* Helper Text */}
          <div className="bg-primary-900/20 border border-primary-600/30 rounded-lg p-3">
            <p className="text-sm text-gray-300">
              💡 <span className="font-semibold">Tip:</span> Create a custom quest that fits your daily routine. Start with easy tasks and gradually increase difficulty!
            </p>
          </div>

          {/* Title */}
          <div>
            <Input
                label="Quest Title"
                placeholder="e.g., Morning Workout, Read for 30 mins"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
                required
                autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
                className="w-full px-4 py-3 bg-dark-700 border-2 border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                rows={3}
                placeholder="Describe your quest in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                  <p className="text-red-400 text-xs">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Quest Icon <span className="text-primary-400">*</span>
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {['⭐', '🎯', '💡', '🔥', '⚡', '💪', '🏃', '📚', '🧘', '🎨', '🎮', '🎵'].map(
                  (icon) => (
                      <button
                          key={icon}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, icon });
                            impact('light');
                          }}
                          className={`aspect-square text-2xl sm:text-3xl p-2 rounded-lg transition-all ${
                              formData.icon === icon
                                  ? 'bg-primary-600 scale-110 shadow-lg shadow-primary-600/50 ring-2 ring-primary-400'
                                  : 'bg-dark-700 hover:bg-dark-600 hover:scale-105'
                          }`}
                      >
                        {icon}
                      </button>
                  )
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Category <span className="text-primary-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((category) => (
                  <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, category: category.id });
                        impact('light');
                      }}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all ${
                          formData.category === category.id
                              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:scale-102'
                      }`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-xs font-medium">{category.name}</span>
                  </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Difficulty <span className="text-primary-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {difficulties.map((diff) => (
                  <button
                      key={diff.id}
                      type="button"
                      onClick={() => {
                        handleDifficultyChange(diff.id);
                        impact('light');
                      }}
                      className={`p-3 rounded-lg transition-all ${
                          formData.difficulty === diff.id
                              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105 ring-2 ring-primary-400'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:scale-102'
                      }`}
                  >
                    <div className="font-semibold text-sm sm:text-base">{diff.name}</div>
                    <div className="text-xs mt-1 flex items-center justify-center gap-1">
                      <span>⚡</span>
                      <span>+{diff.xp} XP</span>
                    </div>
                  </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Frequency <span className="text-primary-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {frequencies.map((freq) => (
                  <button
                      key={freq.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, frequency: freq.id });
                        impact('light');
                      }}
                      className={`p-3 rounded-lg transition-all ${
                          formData.frequency === freq.id
                              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105'
                              : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                      }`}
                  >
                    <span className="text-sm font-medium">{freq.name}</span>
                  </button>
              ))}
            </div>
          </div>

          {/* Stat Bonus */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Stat Bonus <span className="text-primary-400">*</span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <select
                    className="w-full px-4 py-3 bg-dark-700 border-2 border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    value={formData.statBonus.stat}
                    onChange={(e) =>
                        setFormData({
                          ...formData,
                          statBonus: { ...formData.statBonus, stat: e.target.value },
                        })
                    }
                >
                  {stats.map((stat) => (
                      <option key={stat.id} value={stat.id}>
                        {stat.icon} {stat.name}
                      </option>
                  ))}
                </select>
              </div>
              <div className="w-20 sm:w-24">
                <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.statBonus.amount}
                    onChange={(e) =>
                        setFormData({
                          ...formData,
                          statBonus: { ...formData.statBonus, amount: parseInt(e.target.value) || 1 },
                        })
                    }
                    error={errors.statBonus}
                />
              </div>
            </div>
          </div>

          {/* XP Reward */}
          <div>
            <Input
                label="XP Reward"
                type="number"
                min="1"
                max="100"
                value={formData.xpReward}
                onChange={(e) =>
                    setFormData({ ...formData, xpReward: parseInt(e.target.value) || 10 })
                }
                error={errors.xpReward}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
              <span>💡</span>
              <span>Recommended: Easy (10 XP), Medium (20 XP), Hard (30 XP), Legendary (50 XP)</span>
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-dark-700 mt-6">
            <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                fullWidth
                disabled={createQuest.isPending}
            >
              Cancel
            </Button>
            <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={createQuest.isPending}
                disabled={createQuest.isPending}
            >
              {createQuest.isPending ? 'Creating...' : '✨ Create Quest'}
            </Button>
          </div>
        </form>
      </Modal>
  );
};
