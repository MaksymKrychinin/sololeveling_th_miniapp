import { useEffect, useState } from 'react';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

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
