import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthWrapper from './components/auth/AuthWrapper';
import ChatLayout from './components/chat/ChatLayout';
import ProfilePage from './components/profile/ProfilePage';
import Preloader from './components/ui/Preloader';
// Font Awesome configuration
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import './App.css';

// Add all Font Awesome icons to the library
library.add(fas, far, fab);

// App content wrapper to access auth context
function AppContent() {
  const { showLoginPreloader } = useAuth();
  
  return (
    <>
      {/* Login preloader - shows after verification */}
      <Preloader show={showLoginPreloader} />
      
      {/* Main app routes */}
      <Router>
        <div className="app">
          <Routes>
            <Route path="/auth" element={<AuthWrapper />} />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

function App() {
  const [showInitialPreloader, setShowInitialPreloader] = useState(true);
  const [appReady, setAppReady] = useState(false);

  const handleInitialPreloaderComplete = () => {
    setShowInitialPreloader(false);
    setAppReady(true);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <WebSocketProvider>
          {/* Initial app loading preloader */}
          <Preloader 
            show={showInitialPreloader} 
            onComplete={handleInitialPreloaderComplete}
          />
          
          {/* Main app content */}
          {appReady && <AppContent />}
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
