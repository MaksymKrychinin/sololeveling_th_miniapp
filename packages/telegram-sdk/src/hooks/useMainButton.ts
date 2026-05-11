import { useEffect, useCallback } from 'react';

interface MainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
  setParams: (params: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        MainButton: MainButton;
      };
    };
  }
}

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
