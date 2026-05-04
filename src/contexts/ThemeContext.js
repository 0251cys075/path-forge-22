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
  const [theme, setTheme] = useState('dark');
  const [primaryColor, setPrimaryColor] = useState('#FF6B35');
  const [fontSize, setFontSize] = useState('medium');
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Load theme preferences from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('pathforge_theme');
    const savedColor = localStorage.getItem('pathforge_primary_color');
    const savedFontSize = localStorage.getItem('pathforge_font_size');
    const savedAnimations = localStorage.getItem('pathforge_animations_enabled');

    if (savedTheme) setTheme(savedTheme);
    if (savedColor) setPrimaryColor(savedColor);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedAnimations) setAnimationsEnabled(savedAnimations === 'true');
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'light') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--bg-tertiary', '#e9ecef');
      root.style.setProperty('--text-primary', '#212529');
      root.style.setProperty('--text-secondary', '#6c757d');
      root.style.setProperty('--text-tertiary', '#adb5bd');
      root.style.setProperty('--border-color', '#dee2e6');
      root.style.setProperty('--shadow-color', 'rgba(0,0,0,0.1)');
    } else {
      root.style.setProperty('--bg-primary', '#0f0c29');
      root.style.setProperty('--bg-secondary', '#302b63');
      root.style.setProperty('--bg-tertiary', '#24243e');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', 'rgba(255,255,255,0.7)');
      root.style.setProperty('--text-tertiary', 'rgba(255,255,255,0.5)');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
      root.style.setProperty('--shadow-color', 'rgba(0,0,0,0.3)');
    }
    
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-color-light', primaryColor + '22');
    root.style.setProperty('--primary-color-border', primaryColor + '44');
    
    // Font size mapping
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--font-size-base', fontSizes[fontSize]);
    
    // Animations
    if (!animationsEnabled) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    }
  }, [theme, primaryColor, fontSize, animationsEnabled]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('pathforge_theme', newTheme);
  };

  const updatePrimaryColor = (color) => {
    setPrimaryColor(color);
    localStorage.setItem('pathforge_primary_color', color);
  };

  const updateFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('pathforge_font_size', size);
  };

  const toggleAnimations = () => {
    const newValue = !animationsEnabled;
    setAnimationsEnabled(newValue);
    localStorage.setItem('pathforge_animations_enabled', newValue.toString());
  };

  const value = {
    theme,
    primaryColor,
    fontSize,
    animationsEnabled,
    updateTheme,
    updatePrimaryColor,
    updateFontSize,
    toggleAnimations
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
