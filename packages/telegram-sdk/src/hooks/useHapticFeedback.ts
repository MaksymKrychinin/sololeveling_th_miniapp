import { useCallback } from 'react';
import '../types/telegram'; // Import for global type declaration

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'error' | 'success' | 'warning';

export const useHapticFeedback = () => {
  const impact = useCallback((style: ImpactStyle = 'medium') => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
    }
  }, []);

  const notification = useCallback((type: NotificationType) => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
    }
  }, []);

  const selection = useCallback(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }
  }, []);

  return {
    impact,
    notification,
    selection,
  };
};
