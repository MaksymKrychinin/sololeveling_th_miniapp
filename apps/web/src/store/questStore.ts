import { create } from 'zustand';

interface Quest {
  id: string;
  title: string;
  description?: string;
  category: string;
  xpReward: number;
  statBonus?: { stat: string; amount: number };
  frequency: string;
  status: string;
  completedAt?: Date;
  streak: number;
  icon: string;
  difficulty: string;
  isActive: boolean;
}

interface QuestStore {
  quests: Quest[];
  activeQuests: Quest[];
  completedToday: Quest[];
  setQuests: (quests: Quest[]) => void;
  addQuest: (quest: Quest) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  removeQuest: (id: string) => void;
  completeQuest: (id: string) => void;
  getQuestsByCategory: (category: string) => Quest[];
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  quests: [],
  activeQuests: [],
  completedToday: [],

  setQuests: (quests) => {
    const active = quests.filter((q) => q.isActive);
    const completed = quests.filter(
      (q) => q.status === 'completed' && q.completedAt && isToday(new Date(q.completedAt))
    );

    set({
      quests,
      activeQuests: active,
      completedToday: completed,
    });
  },

  addQuest: (quest) =>
    set((state) => ({
      quests: [...state.quests, quest],
      activeQuests: quest.isActive ? [...state.activeQuests, quest] : state.activeQuests,
    })),

  updateQuest: (id, updates) =>
    set((state) => {
      const quests = state.quests.map((q) => (q.id === id ? { ...q, ...updates } : q));
      const activeQuests = quests.filter((q) => q.isActive);
      return { quests, activeQuests };
    }),

  removeQuest: (id) =>
    set((state) => ({
      quests: state.quests.filter((q) => q.id !== id),
      activeQuests: state.activeQuests.filter((q) => q.id !== id),
    })),

  completeQuest: (id) =>
    set((state) => {
      const quests = state.quests.map((q) =>
        q.id === id
          ? { ...q, status: 'completed', completedAt: new Date(), streak: q.streak + 1 }
          : q
      );
      const completedToday = quests.filter(
        (q) => q.status === 'completed' && q.completedAt && isToday(new Date(q.completedAt))
      );
      return { quests, completedToday };
    }),

  getQuestsByCategory: (category) => {
    return get().quests.filter((q) => q.category === category);
  },
}));

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
