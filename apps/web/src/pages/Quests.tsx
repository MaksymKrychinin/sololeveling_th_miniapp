import { useState } from 'react';
import { useQuestTemplates, useCreateQuestFromTemplate, useToggleQuest } from '../hooks/useApi';
import { Card, Button, Badge, Spinner, useToast } from '@solo-leveling/ui';
import { useHapticFeedback } from '@solo-leveling/telegram-sdk';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: 'All', icon: '✨' },
  { id: 'hygiene', name: 'Hygiene', icon: '🚿' },
  { id: 'health', name: 'Health', icon: '🥗' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'learning', name: 'Learning', icon: '📚' },
  { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
  { id: 'productivity', name: 'Productivity', icon: '⚡' },
  { id: 'social', name: 'Social', icon: '👥' },
];

const Quests = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: templatesData, isLoading } = useQuestTemplates();
  const createFromTemplate = useCreateQuestFromTemplate();
  const { addToast } = useToast();
  const { impact, notification } = useHapticFeedback();

  const templates = templatesData?.data || [];
  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t: any) => t.category === selectedCategory);

  const handleAddQuest = async (templateId: string, title: string) => {
    try {
      impact('medium');
      await createFromTemplate.mutateAsync(templateId);
      notification('success');
      addToast({
        message: `"${title}" added to your quests!`,
        type: 'success',
      });
    } catch (error: any) {
      notification('error');
      addToast({
        message: error.message || 'Failed to add quest',
        type: 'error',
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'primary';
      case 'hard':
        return 'warning';
      case 'legendary':
        return 'danger';
      default:
        return 'default';
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
        <h1 className="text-3xl font-bold font-display text-primary-400 mb-2">Quest Library</h1>
        <p className="text-gray-400">Add quests to your daily routine</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              impact('selection');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-primary-600 text-white'
                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Quest Templates Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTemplates.length === 0 ? (
          <Card padding="lg">
            <p className="text-center text-gray-400">No quests found in this category.</p>
          </Card>
        ) : (
          filteredTemplates.map((template: any) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card padding="md" hoverable>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-4xl">{template.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{template.title}</h3>
                      <Badge variant={getDifficultyColor(template.difficulty)} size="sm">
                        {template.difficulty}
                      </Badge>
                      {template.isDefault && (
                        <Badge variant="primary" size="sm">
                          Default
                        </Badge>
                      )}
                    </div>

                    {template.description && (
                      <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">⚡ +{template.xpReward} XP</span>
                      {template.statBonus && (
                        <span className="flex items-center gap-1">
                          📈 +{template.statBonus.amount} {template.statBonus.stat}
                        </span>
                      )}
                      <span className="flex items-center gap-1 capitalize">
                        🔁 {template.frequency}
                      </span>
                    </div>
                  </div>

                  {/* Add Button */}
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleAddQuest(template.id, template.title)}
                    isLoading={createFromTemplate.isPending}
                    disabled={createFromTemplate.isPending}
                  >
                    Add Quest
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Info Card */}
      <Card variant="glass" padding="md">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-white mb-1">Pro Tip</h4>
            <p className="text-sm text-gray-400">
              Start with 3-5 quests that fit your daily routine. You can always add more later!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Quests;
