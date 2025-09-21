import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authStep, setAuthStep] = useState('id-verification'); // id-verification, otp-verification, photo-verification, authenticated
  const [showLoginPreloader, setShowLoginPreloader] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setAuthStep('authenticated');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Show preloader when user successfully logs in
    setShowLoginPreloader(true);
    
    // After preloader timeout, complete the login
    setTimeout(() => {
      setUser(userData);
      setAuthStep('authenticated');
      localStorage.setItem('authUser', JSON.stringify(userData));
      setShowLoginPreloader(false);
    }, 3500); // 3s preloader + 0.5s fade out
  };

  const logout = () => {
    console.log('AuthContext: logout called');
    console.log('AuthContext: current user:', user);
    console.log('AuthContext: current authStep:', authStep);
    setUser(null);
    setAuthStep('id-verification');
    localStorage.removeItem('authUser');
    console.log('AuthContext: logout completed');
    console.log('AuthContext: new user:', null);
    console.log('AuthContext: new authStep:', 'id-verification');
  };

  const nextAuthStep = (step) => {
    setAuthStep(step);
  };

  const value = {
    user,
    loading,
    authStep,
    login,
    logout,
    nextAuthStep,
    showLoginPreloader,
    isAuthenticated: !!user && authStep === 'authenticated'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};