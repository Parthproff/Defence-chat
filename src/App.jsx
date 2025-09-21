import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthWrapper from './components/auth/AuthWrapper';
import ChatLayout from './components/chat/ChatLayout';
import ProfilePage from './components/profile/ProfilePage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WebSocketProvider>
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
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
