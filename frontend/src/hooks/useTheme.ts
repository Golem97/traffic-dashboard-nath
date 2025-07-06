// Light theme only hook
export const useTheme = () => {
  const themeClasses = {
    background: 'min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100',
    card: 'bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50',
    title: 'text-gray-900',
    subtitle: 'text-gray-600',
    cardText: 'text-gray-900',
    button: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800',
    navbar: 'bg-white/80 backdrop-blur-md border-b border-gray-200/50',
    navItem: 'text-gray-700 hover:text-gray-900',
    divider: 'border-gray-200',
    hover: 'hover:bg-gray-50',
    // AuthPage specific classes
    floatingBg: ['bg-gray-200 opacity-20', 'bg-gray-300 opacity-20', 'bg-gray-400 opacity-20'],
    tabContainer: 'bg-gray-100/80 border border-gray-200',
    activeTab: 'bg-gray-900 text-white shadow-lg',
    inactiveTab: 'text-gray-600 hover:text-gray-900',
    error: 'bg-red-50 border border-red-200 text-red-700',
    icon: 'text-gray-400',
    iconHover: 'hover:text-gray-600',
    input: 'bg-white/50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-gray-500/50 focus:border-gray-500',
    socialButton: 'bg-white/60 hover:bg-white/80 text-gray-900 border border-gray-200',
    footer: 'bg-gray-50/80 border-gray-200',
    footerText: 'text-gray-600',
    chartPlaceholder: 'bg-gray-100/50 border border-gray-200'
  };

  return {
    themeClasses
  };
}; 