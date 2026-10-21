import { useAuth } from '../context/AuthContext';
import { translations } from './translations';

export const useT = () => {
  const { language, toggleLanguage } = useAuth();

  const t = (key: string, fallback?: string): string => {
    const item = translations[key];
    if (!item) {
      return fallback !== undefined ? fallback : key;
    }
    return item[language] || item.en || (fallback !== undefined ? fallback : key);
  };

  return { t, language, toggleLanguage };
};
