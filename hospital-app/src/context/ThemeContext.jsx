import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const THEME_KEY = 'medidiag_theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
