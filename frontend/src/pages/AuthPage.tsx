import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Navigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  const { login, register, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(loginForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        displayName: registerForm.displayName
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration error');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      x: isLogin ? 20 : -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className={themeClasses.background + " flex items-center justify-center p-4"}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${themeClasses.floatingBg[0]} rounded-full mix-blend-multiply filter blur-xl animate-float`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${themeClasses.floatingBg[1]} rounded-full mix-blend-multiply filter blur-xl animate-float`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${themeClasses.floatingBg[2]} rounded-full mix-blend-multiply filter blur-xl animate-float`} style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full ${themeClasses.socialButton} transition-all duration-200`}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass Card */}
        <div className={themeClasses.card + " overflow-hidden"}>
          {/* Header */}
          <div className="p-8 pb-6">
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold ${themeClasses.title} mb-2`}>
                Traffic Dashboard
              </h1>
              <p className={`text-sm ${themeClasses.subtitle}`}>
                Manage your traffic data with elegance
              </p>
            </div>

            {/* Tab Switcher */}
            <div className={`flex ${themeClasses.tabContainer} rounded-xl p-1 mb-6`}>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isLogin ? themeClasses.activeTab : themeClasses.inactiveTab
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !isLogin ? themeClasses.activeTab : themeClasses.inactiveTab
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${themeClasses.error} rounded-lg p-3 mb-6`}
              >
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Forms */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <motion.form
                    key="login"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    {/* Email Input */}
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} w-5 h-5`} />
                      <input
                        type="email"
                        placeholder="Email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 ${themeClasses.input} rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} w-5 h-5`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 ${themeClasses.input} rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} ${themeClasses.iconHover} transition-colors`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Login Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full ${themeClasses.button} py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    {/* Display Name Input */}
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} w-5 h-5`} />
                      <input
                        type="text"
                        placeholder="Display Name"
                        value={registerForm.displayName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, displayName: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 ${themeClasses.input} rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        required
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} w-5 h-5`} />
                      <input
                        type="email"
                        placeholder="Email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-3 ${themeClasses.input} rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} w-5 h-5`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 ${themeClasses.input} rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} ${themeClasses.iconHover} transition-colors`}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} w-5 h-5`} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`w-full pl-10 pr-12 py-3 ${themeClasses.input} rounded-xl focus:outline-none focus:ring-2 transition-all duration-200`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} ${themeClasses.iconHover} transition-colors`}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Register Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full ${themeClasses.button} py-3 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Sign Up</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className={`px-8 py-6 ${themeClasses.footer} border-t`}>
            <div className="text-center">
              <p className={`${themeClasses.footerText} text-sm mb-4`}>
                Or continue with
              </p>
              <div className="flex space-x-3">
                <button className={`flex-1 ${themeClasses.socialButton} py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2`}>
                  <Chrome className="w-5 h-5" />
                  <span>Google</span>
                </button>
                <button className={`flex-1 ${themeClasses.socialButton} py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2`}>
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className={`${themeClasses.footerText} text-sm`}>
            By signing in, you agree to our{' '}
            <a href="#" className={`${themeClasses.link} transition-colors underline`}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className={`${themeClasses.link} transition-colors underline`}>
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage; 