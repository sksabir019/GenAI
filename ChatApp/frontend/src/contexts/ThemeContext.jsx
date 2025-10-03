import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('chat-theme');
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Apply theme to DOM immediately on mount and whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first to avoid conflicts
    root.classList.remove('dark', 'light');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#111827'; // gray-900
    } else {
      root.classList.add('light');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#ffffff';
    }
    
    // Store in localStorage
    localStorage.setItem('chat-theme', theme);
  }, [theme]);



  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};