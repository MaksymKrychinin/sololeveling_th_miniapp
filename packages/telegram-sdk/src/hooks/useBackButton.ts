import { useEffect, useCallback } from 'react';
import '../types/telegram'; // Import for global type declaration

export const useBackButton = (onClick?: () => void) => {
  const backButton = typeof window !== 'undefined' ? window.Telegram?.WebApp?.BackButton : null;

  useEffect(() => {
    if (!backButton) return;

    if (onClick) {
      backButton.onClick(onClick);
      backButton.show();
    }

    return () => {
      if (onClick) {
        backButton.offClick(onClick);
      }
      backButton.hide();
    };
  }, [onClick, backButton]);

  const show = useCallback(() => {
    backButton?.show();
  }, [backButton]);

  const hide = useCallback(() => {
    backButton?.hide();
  }, [backButton]);

  return {
    show,
    hide,
  };
};
