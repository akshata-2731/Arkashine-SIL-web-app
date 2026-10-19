import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeColors {
  id: string;
  name: string;
  category: string;
  // Primary brand / sidebar
  primary: string;         // e.g. #143D30
  primaryDark: string;     // e.g. #0E2C23 (sidebar role badge & footer)
  primaryLight: string;    // e.g. #1B4D3E
  // Accent & interactions
  accent: string;          // e.g. #10B981 (emerald-500)
  accentHover: string;     // e.g. #059669 (emerald-600)
  accentSoft: string;      // e.g. #ECFDF5 (emerald-50)
  accentBorder: string;    // e.g. #A7F3D0 (emerald-200)
  accentText: string;      // e.g. #065F46 (emerald-800)
  // Background
  bgPage: string;          // e.g. #F8FAFC
  // Preview dot
  dotColor: string;
}

export const PRESET_THEMES: ThemeColors[] = [
  {
    id: 'forest-emerald',
    name: 'Forest Emerald',
    category: 'Nature & Agritech',
    primary: '#143D30',
    primaryDark: '#0E2C23',
    primaryLight: '#1E5644',
    accent: '#10B981',
    accentHover: '#059669',
    accentSoft: '#ECFDF5',
    accentBorder: '#A7F3D0',
    accentText: '#065F46',
    bgPage: '#F8FAFC',
    dotColor: '#10B981'
  },
  {
    id: 'deep-navy',
    name: 'Deep Navy & Sky',
    category: 'Corporate & Ed-Tech',
    primary: '#0F172A',
    primaryDark: '#020617',
    primaryLight: '#1E293B',
    accent: '#0284C7',
    accentHover: '#0369A1',
    accentSoft: '#F0F9FF',
    accentBorder: '#BAE6FD',
    accentText: '#0369A1',
    bgPage: '#F8FAFC',
    dotColor: '#0284C7'
  },
  {
    id: 'earth-terracotta',
    name: 'Warm Earth & Amber',
    category: 'Soil & Agriculture',
    primary: '#3F2012',
    primaryDark: '#2C160B',
    primaryLight: '#572E1B',
    accent: '#D97706',
    accentHover: '#B45309',
    accentSoft: '#FFFBEB',
    accentBorder: '#FDE68A',
    accentText: '#92400E',
    bgPage: '#FAFAF9',
    dotColor: '#D97706'
  },
  {
    id: 'modern-teal',
    name: 'Modern Ocean Teal',
    category: 'Sustainability',
    primary: '#0F2F35',
    primaryDark: '#0A2024',
    primaryLight: '#164E58',
    accent: '#0D9488',
    accentHover: '#0F766E',
    accentSoft: '#F0FDFA',
    accentBorder: '#99F6E4',
    accentText: '#115E59',
    bgPage: '#F8FAFC',
    dotColor: '#0D9488'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple & Violet',
    category: 'Innovation & Science',
    primary: '#241442',
    primaryDark: '#190D2E',
    primaryLight: '#3B2064',
    accent: '#8B5CF6',
    accentHover: '#7C3AED',
    accentSoft: '#F5F3FF',
    accentBorder: '#DDD6FE',
    accentText: '#5B21B6',
    bgPage: '#FAFAFA',
    dotColor: '#8B5CF6'
  },
  {
    id: 'pure-minimal',
    name: 'Minimal Slate & Charcoal',
    category: 'Minimalist Clean',
    primary: '#18181B',
    primaryDark: '#09090B',
    primaryLight: '#27272A',
    accent: '#475569',
    accentHover: '#334155',
    accentSoft: '#F1F5F9',
    accentBorder: '#CBD5E1',
    accentText: '#1E293B',
    bgPage: '#F8FAFC',
    dotColor: '#475569'
  }
];

interface ThemeContextType {
  currentTheme: ThemeColors;
  setThemeById: (id: string) => void;
  setCustomColor: (key: keyof ThemeColors, value: string) => void;
  resetDefaultTheme: () => void;
  allThemes: ThemeColors[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'arkashine_theme_colors_v1';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.primary) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return PRESET_THEMES[0];
  });

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', currentTheme.primary);
    root.style.setProperty('--theme-primary-dark', currentTheme.primaryDark);
    root.style.setProperty('--theme-primary-light', currentTheme.primaryLight);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-accent-hover', currentTheme.accentHover);
    root.style.setProperty('--theme-accent-soft', currentTheme.accentSoft);
    root.style.setProperty('--theme-accent-border', currentTheme.accentBorder);
    root.style.setProperty('--theme-accent-text', currentTheme.accentText);
    root.style.setProperty('--theme-bg-page', currentTheme.bgPage);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTheme));
    } catch (e) {
      // ignore
    }
  }, [currentTheme]);

  const setThemeById = (id: string) => {
    const found = PRESET_THEMES.find(t => t.id === id);
    if (found) {
      setCurrentTheme(found);
    }
  };

  const setCustomColor = (key: keyof ThemeColors, value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      id: 'custom',
      name: 'Custom Palette',
      [key]: value
    }));
  };

  const resetDefaultTheme = () => {
    setCurrentTheme(PRESET_THEMES[0]);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setThemeById,
        setCustomColor,
        resetDefaultTheme,
        allThemes: PRESET_THEMES
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
