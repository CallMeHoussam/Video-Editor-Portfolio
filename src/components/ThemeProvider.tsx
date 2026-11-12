'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

const themeListeners = new Set<() => void>();

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  if (typeof window === 'undefined') {
    return () => {
      themeListeners.delete(listener);
    };
  }
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'evoless_theme') listener();
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

function readStoredTheme(fallback: Theme): Theme {
  try {
    const saved = localStorage.getItem('evoless_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // Fallback to defaultTheme
  }
  return fallback;
}

function applyThemeToDocument(targetTheme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (targetTheme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    () => readStoredTheme(defaultTheme),
    () => defaultTheme
  );

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('evoless_theme', newTheme);
    } catch {
      // Ignore in private browsing
    }
    applyThemeToDocument(newTheme);
    themeListeners.forEach((listener) => listener());
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
