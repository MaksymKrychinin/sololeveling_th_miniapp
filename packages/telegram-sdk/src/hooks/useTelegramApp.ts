import { useEffect, useState } from 'react';
import type { TelegramWebApp } from '../types';

export const useTelegramApp = () => {
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const app = window.Telegram.WebApp;
      setWebApp(app);
      app.ready();
      app.expand();
      setIsReady(true);
    }
  }, []);

  const close = () => {
    webApp?.close();
  };

  const enableClosingConfirmation = () => {
    webApp?.enableClosingConfirmation();
  };

  const disableClosingConfirmation = () => {
    webApp?.disableClosingConfirmation();
  };

  return {
    webApp,
    isReady,
    close,
    enableClosingConfirmation,
    disableClosingConfirmation,
  };
};
