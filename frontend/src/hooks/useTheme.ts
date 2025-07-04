import { useState } from 'react';

export interface ThemeClasses {
  background: string;
  card: string;
  title: string;
  subtitle: string;
  tabContainer: string;
  activeTab: string;
  inactiveTab: string;
  input: string;
  icon: string;
  iconHover: string;
  button: string;
  footer: string;
  footerText: string;
  socialButton: string;
  error: string;
  link: string;
  floatingBg: string[];
  header: string;
  cardText: string;
  cardSubtext: string;
  toggleButton: string;
  chartPlaceholder: string;
}

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getThemeClasses = (): ThemeClasses => ({
    background: isDarkMode 
      ? "min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800" 
      : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100",
    
    card: isDarkMode 
      ? "bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10" 
      : "bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50",
    
    title: isDarkMode ? "text-white" : "text-gray-900",
    subtitle: isDarkMode ? "text-gray-400" : "text-gray-600",
    
    tabContainer: isDarkMode 
      ? "bg-black/20 border border-white/10" 
      : "bg-gray-100/80 border border-gray-200",
    
    activeTab: isDarkMode 
      ? "bg-white text-black shadow-lg" 
      : "bg-gray-900 text-white shadow-lg",
    
    inactiveTab: isDarkMode 
      ? "text-gray-400 hover:text-white" 
      : "text-gray-600 hover:text-gray-900",
    
    input: isDarkMode 
      ? "bg-black/20 border border-white/20 text-white placeholder-gray-500 focus:ring-white/50 focus:border-white/50" 
      : "bg-white/50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-gray-500/50 focus:border-gray-500",
    
    icon: isDarkMode ? "text-gray-500" : "text-gray-400",
    iconHover: isDarkMode ? "hover:text-white" : "hover:text-gray-600",
    
    button: isDarkMode 
      ? "bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-700 hover:to-gray-900 border border-white/20" 
      : "bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 border border-gray-300",
    
    footer: isDarkMode ? "bg-black/20 border-white/10" : "bg-gray-50/80 border-gray-200",
    footerText: isDarkMode ? "text-gray-500" : "text-gray-600",
    
    socialButton: isDarkMode 
      ? "bg-white/10 hover:bg-white/20 text-white border border-white/20" 
      : "bg-white/60 hover:bg-white/80 text-gray-900 border border-gray-200",
    
    error: isDarkMode 
      ? "bg-red-900/30 border border-red-800/50 text-red-300" 
      : "bg-red-50 border border-red-200 text-red-700",
    
    link: isDarkMode 
      ? "text-white hover:text-gray-300" 
      : "text-gray-800 hover:text-gray-600",
    
    floatingBg: isDarkMode 
      ? ["bg-white opacity-5", "bg-gray-300 opacity-5", "bg-gray-500 opacity-5"]
      : ["bg-gray-200 opacity-20", "bg-gray-300 opacity-20", "bg-gray-400 opacity-20"],

    // Dashboard specific classes
    header: isDarkMode 
      ? "bg-white/5 backdrop-blur-md border-b border-white/10" 
      : "bg-white/80 backdrop-blur-md border-b border-gray-200/50",
    
    cardText: isDarkMode ? "text-white" : "text-gray-900",
    cardSubtext: isDarkMode ? "text-gray-400" : "text-gray-600",
    
    toggleButton: isDarkMode 
      ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-200 border border-white/20" 
      : "bg-gray-800/80 hover:bg-gray-900/80 text-white border border-gray-300",
    
    chartPlaceholder: isDarkMode 
      ? "bg-black/20 border border-white/10" 
      : "bg-gray-100/50 border border-gray-200"
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return {
    isDarkMode,
    toggleTheme,
    themeClasses: getThemeClasses()
  };
}; 