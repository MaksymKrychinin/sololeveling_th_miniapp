import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { useUserStore } from '@/store/userStore';

// Auth

export const useLogin = () => {
  const { setUser, setToken } = useUserStore();

  return useMutation({
    mutationFn: async (initData: string) => {
      return apiClient.post('/auth/telegram', { initData });
    },
    onSuccess: (data: any) => {
      setToken(data.data.token);
      setUser(data.data.user);
    },
  });
};

export const useLogout = () => {
  const { logout } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      return apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      logout();
    },
  });
};

// User

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return apiClient.get('/users/profile');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { avatar?: string; timezone?: string }) => {
      return apiClient.patch('/users/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      return apiClient.get('/users/stats');
    },
  });
};

// Quests

export const useQuests = (isActive?: boolean) => {
  return useQuery({
    queryKey: ['quests', isActive],
    queryFn: async () => {
      const params = isActive !== undefined ? { isActive } : {};
      return apiClient.get('/quests', { params });
    },
  });
};

export const useQuestTemplates = () => {
  return useQuery({
    queryKey: ['quest-templates'],
    queryFn: async () => {
      return apiClient.get('/quests/templates');
    },
  });
};

export const useCreateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      return apiClient.post('/quests', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

export const useCreateQuestFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      return apiClient.post('/quests/from-template', { templateId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

export const useCompleteQuest = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation({
    mutationFn: async (questId: string) => {
      return apiClient.post(`/quests/${questId}/complete`);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });

      // Update user in store if leveled up
      if (data.data.levelUp) {
        updateUser({
          level: data.data.levelUp.newLevel,
          title: data.data.levelUp.newTitle,
        });
      }
    },
  });
};

export const useToggleQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questId, isActive }: { questId: string; isActive: boolean }) => {
      return apiClient.patch(`/quests/${questId}/toggle`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

export const useDeleteQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questId: string) => {
      return apiClient.delete(`/quests/${questId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });
};

// Achievements

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      return apiClient.get('/achievements');
    },
  });
};

export const useUserAchievements = () => {
  return useQuery({
    queryKey: ['user-achievements'],
    queryFn: async () => {
      return apiClient.get('/achievements/user');
    },
  });
};

// Leaderboard

export const useLeaderboard = (type: string = 'level', period: string = 'all_time') => {
  return useQuery({
    queryKey: ['leaderboard', type, period],
    queryFn: async () => {
      return apiClient.get('/leaderboard', { params: { type, period } });
    },
  });
};
