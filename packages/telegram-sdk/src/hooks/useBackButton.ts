import { useEffect, useCallback } from 'react';

interface BackButton {
  isVisible: boolean;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        BackButton: BackButton;
      };
    };
  }
}

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
