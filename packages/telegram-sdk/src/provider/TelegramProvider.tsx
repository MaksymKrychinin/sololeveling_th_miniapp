import React, { useEffect } from 'react';

interface TelegramProviderProps {
  children: React.ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;

      // Initialize Telegram WebApp
      webApp.ready();
      webApp.expand();

      // Set default theme
      document.documentElement.classList.add('dark');
    }
  }, []);

  return <>{children}</>;
};
