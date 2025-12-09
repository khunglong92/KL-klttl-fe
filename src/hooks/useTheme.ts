import { useEffect } from 'react';
import { useMantineColorScheme } from '@mantine/core';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const theme = (colorScheme || 'light') as Theme;

  // Đồng bộ class 'dark' với Mantine colorScheme để Tailwind dark mode hoạt động
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setColorScheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
}
