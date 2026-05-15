import { useState, useEffect } from 'react';
import type { ThemeParams } from '../types';

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
