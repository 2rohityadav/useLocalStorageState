import React, { useEffect } from 'react';
import useLocalStorage from './hooks/use-local-storage';

type ThemeType = 'light-theme' | 'dark-theme';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<ThemeType>('light-theme');

  const toggleTheme = (): void => {
    const newTheme = theme === 'light-theme' ? 'dark-theme' : 'light-theme';
    setTheme(newTheme);
  };

  useEffect(() => {
    if (theme) {
      document.documentElement.className = theme;
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <main>
      <nav>
        <button type="button" onClick={toggleTheme}>
          toggle
        </button>
      </nav>
      <div>{theme}</div>
    </main>
  );
};

export default App;
