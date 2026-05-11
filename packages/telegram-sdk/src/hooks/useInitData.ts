import { useState, useEffect } from 'react';

interface InitDataUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface InitData {
  query_id?: string;
  user?: InitDataUser;
  auth_date?: number;
  hash?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: InitData;
      };
    };
  }
}

export const useInitData = () => {
  const [initData, setInitData] = useState<string>('');
  const [initDataUnsafe, setInitDataUnsafe] = useState<InitData>({});
  const [user, setUser] = useState<InitDataUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      setInitData(webApp.initData || '');
      setInitDataUnsafe(webApp.initDataUnsafe || {});
      setUser(webApp.initDataUnsafe?.user || null);
    }
  }, []);

  return {
    initData,
    initDataUnsafe,
    user,
  };
};
