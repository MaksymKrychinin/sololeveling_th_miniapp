import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  id: string;
  telegramId: number;
  username: string;
  firstName?: string;
  lastName?: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  avatar?: string;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
    sense: number;
  };
  streak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalXP: number;
}

interface UserStore {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  setToken: (token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setToken: (token) =>
        set({
          token,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'user-storage',
    }
  )
);
