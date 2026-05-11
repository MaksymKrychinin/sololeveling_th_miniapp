import { useState, useEffect } from 'react';

type ThemeParams = {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        colorScheme: 'light' | 'dark';
        themeParams: ThemeParams;
      };
    };
  }
}

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');
  const [themeParams, setThemeParams] = useState<ThemeParams>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      setColorScheme(webApp.colorScheme || 'dark');
      setThemeParams(webApp.themeParams || {});
    }
  }, []);

  const isDark = colorScheme === 'dark';

  return {
    colorScheme,
    themeParams,
    isDark,
  };
};
