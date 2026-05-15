import { useEffect, useCallback } from 'react';
import '../types/telegram'; // Import for global type declaration

export const useMainButton = (text?: string, onClick?: () => void) => {
  const mainButton = typeof window !== 'undefined' ? window.Telegram?.WebApp?.MainButton : null;

  useEffect(() => {
    if (!mainButton) return;

    if (text) {
      mainButton.setText(text);
      mainButton.show();
    }

    if (onClick) {
      mainButton.onClick(onClick);
    }

    return () => {
      if (onClick) {
        mainButton.offClick(onClick);
      }
      mainButton.hide();
    };
  }, [text, onClick, mainButton]);

  const show = useCallback(() => {
    mainButton?.show();
  }, [mainButton]);

  const hide = useCallback(() => {
    mainButton?.hide();
  }, [mainButton]);

  const setText = useCallback(
    (newText: string) => {
      mainButton?.setText(newText);
    },
    [mainButton]
  );

  const enable = useCallback(() => {
    mainButton?.enable();
  }, [mainButton]);

  const disable = useCallback(() => {
    mainButton?.disable();
  }, [mainButton]);

  const showProgress = useCallback(() => {
    mainButton?.showProgress();
  }, [mainButton]);

  const hideProgress = useCallback(() => {
    mainButton?.hideProgress();
  }, [mainButton]);

  return {
    show,
    hide,
    setText,
    enable,
    disable,
    showProgress,
    hideProgress,
  };
};
