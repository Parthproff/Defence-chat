import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import IdVerification from './IdVerification';
import OtpVerification from './OtpVerification';
import PhotoVerification from './PhotoVerification';
import ThemeToggle from '../ui/ThemeToggle';

const AuthWrapper = () => {
  const { authStep, isAuthenticated } = useAuth();

  console.log('AuthWrapper: isAuthenticated:', isAuthenticated);
  console.log('AuthWrapper: authStep:', authStep);

  if (isAuthenticated) {
    console.log('AuthWrapper: User is authenticated, redirecting to /chat');
    return <Navigate to="/chat" replace />;
  }

  console.log('AuthWrapper: User not authenticated, showing auth step:', authStep);

  return (
    <div className="auth-wrapper">
      <ThemeToggle />
      {(() => {
        switch (authStep) {
          case 'id-verification':
            return <IdVerification />;
          case 'otp-verification':
            return <OtpVerification />;
          case 'photo-verification':
            return <PhotoVerification />;
          default:
            return <IdVerification />;
        }
      })()}
    </div>
  );
};

export default AuthWrapper;