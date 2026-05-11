import { useState } from 'react';
import {
  useQuests,
  useQuestTemplates,
  useCreateQuestFromTemplate,
  useToggleQuest,
  useDeleteQuest,
} from '../hooks/useApi';
import { Card, Button, Badge, Spinner, useToast } from '@solo-leveling/ui';
import { useHapticFeedback } from '@solo-leveling/telegram-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateQuestModal } from '../components/quest/CreateQuestModal';

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
  const [activeTab, setActiveTab] = useState<'my-quests' | 'library'>('my-quests');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: myQuestsData, isLoading: myQuestsLoading } = useQuests();
  const { data: templatesData, isLoading: templatesLoading } = useQuestTemplates();
  const createFromTemplate = useCreateQuestFromTemplate();
  const toggleQuest = useToggleQuest();
  const deleteQuest = useDeleteQuest();
  const { addToast } = useToast();
  const { impact, notification } = useHapticFeedback();

  const myQuests = myQuestsData?.data || [];
  const templates = templatesData?.data || [];

  const activeQuests = myQuests.filter((q: any) => q.isActive);
  const inactiveQuests = myQuests.filter((q: any) => !q.isActive);

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

  const handleToggleQuest = async (questId: string, currentStatus: boolean, title: string) => {
    try {
      impact('light');
      await toggleQuest.mutateAsync({ questId, isActive: !currentStatus });
      addToast({
        message: `${title} ${!currentStatus ? 'activated' : 'deactivated'}`,
        type: 'success',
      });
    } catch (error: any) {
      addToast({
        message: error.message || 'Failed to toggle quest',
        type: 'error',
      });
    }
  };

  const handleDeleteQuest = async (questId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      impact('medium');
      await deleteQuest.mutateAsync(questId);
      notification('success');
      addToast({
        message: `"${title}" deleted`,
        type: 'success',
      });
    } catch (error: any) {
      notification('error');
      addToast({
        message: error.message || 'Failed to delete quest',
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

  if (myQuestsLoading || templatesLoading) {
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
          Quest Management
        </h1>
        <p className="text-gray-400">Manage your daily quests and discover new challenges</p>
      </div>

      {/* Create Quest Modal */}
      <CreateQuestModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* Tab Navigation with Create Button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 border-b border-dark-700 flex-1">
          <button
            onClick={() => {
              setActiveTab('my-quests');
              impact('selection');
            }}
            className={`px-4 py-3 font-medium transition-all relative ${
              activeTab === 'my-quests'
                ? 'text-primary-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            My Quests ({myQuests.length})
            {activeTab === 'my-quests' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
              />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('library');
              impact('selection');
            }}
            className={`px-4 py-3 font-medium transition-all relative ${
              activeTab === 'library'
                ? 'text-primary-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Quest Library ({templates.length})
            {activeTab === 'library' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
              />
            )}
          </button>
        </div>

        {/* Create Button - Responsive */}
        <Button
          variant="primary"
          onClick={() => {
            setShowCreateModal(true);
            impact('medium');
          }}
          className="flex items-center gap-2 whitespace-nowrap"
          size="md"
        >
          <span className="text-xl">+</span>
          <span className="hidden sm:inline">Create Quest</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* My Quests Tab */}
      {activeTab === 'my-quests' && (
        <div className="space-y-6">
          {/* Active Quests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                Active Quests
                <Badge variant="primary" className="ml-2">
                  {activeQuests.length}
                </Badge>
              </h2>
            </div>

            {activeQuests.length === 0 ? (
              <Card padding="lg">
                <div className="text-center py-8">
                  <span className="text-6xl mb-4 block">📋</span>
                  <h3 className="text-xl font-bold text-white mb-2">No Active Quests</h3>
                  <p className="text-gray-400 mb-4">
                    Add quests from the Quest Library to start tracking your daily habits
                  </p>
                  <Button onClick={() => setActiveTab('library')} variant="primary">
                    Browse Quest Library
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <AnimatePresence>
                  {activeQuests.map((quest: any) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onToggle={handleToggleQuest}
                      onDelete={handleDeleteQuest}
                      getDifficultyColor={getDifficultyColor}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Inactive Quests */}
          {inactiveQuests.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Inactive Quests
                <Badge variant="secondary" className="ml-2">
                  {inactiveQuests.length}
                </Badge>
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <AnimatePresence>
                  {inactiveQuests.map((quest: any) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onToggle={handleToggleQuest}
                      onDelete={handleDeleteQuest}
                      getDifficultyColor={getDifficultyColor}
                      inactive
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quest Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-6">
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
                <TemplateCard
                  key={template.id}
                  template={template}
                  onAdd={handleAddQuest}
                  getDifficultyColor={getDifficultyColor}
                  isAdding={createFromTemplate.isPending}
                />
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
      )}

      {/* Floating Action Button (Mobile) - Show only on My Quests tab */}
      {activeTab === 'my-quests' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowCreateModal(true);
            impact('medium');
          }}
          className="fixed bottom-20 right-4 z-10 md:hidden w-14 h-14 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full shadow-lg shadow-primary-600/50 flex items-center justify-center text-white text-2xl"
        >
          +
        </motion.button>
      )}
    </div>
  );
};

const QuestCard: React.FC<{
  quest: any;
  onToggle: (id: string, status: boolean, title: string) => void;
  onDelete: (id: string, title: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  inactive?: boolean;
}> = ({ quest, onToggle, onDelete, getDifficultyColor, inactive = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        padding="md"
        hoverable
        className={inactive ? 'opacity-60' : ''}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-4xl">{quest.icon}</div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">{quest.title}</h3>
              <Badge variant={getDifficultyColor(quest.difficulty)} size="sm">
                {quest.difficulty}
              </Badge>
              {!quest.isActive && (
                <Badge variant="secondary" size="sm">
                  Inactive
                </Badge>
              )}
            </div>

            {quest.description && (
              <p className="text-sm text-gray-400 mb-3">{quest.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">⚡ +{quest.xpReward} XP</span>
              {quest.statBonus && (
                <span className="flex items-center gap-1">
                  📈 +{quest.statBonus.amount} {quest.statBonus.stat}
                </span>
              )}
              <span className="flex items-center gap-1">🔥 {quest.streak} day streak</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant={quest.isActive ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onToggle(quest.id, quest.isActive, quest.title)}
            >
              {quest.isActive ? 'Disable' : 'Enable'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(quest.id, quest.title)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Template Card Component for Quest Library
const TemplateCard: React.FC<{
  template: any;
  onAdd: (id: string, title: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  isAdding: boolean;
}> = ({ template, onAdd, getDifficultyColor, isAdding }) => {
  return (
    <motion.div
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
            onClick={() => onAdd(template.id, template.title)}
            isLoading={isAdding}
            disabled={isAdding}
          >
            Add Quest
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Quests;
