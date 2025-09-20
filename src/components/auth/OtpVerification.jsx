import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './OtpVerification.css';

const OtpVerification = () => {
  const { nextAuthStep } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept any 6-digit OTP
      if (otpString.length === 6) {
        nextAuthStep('photo-verification');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setCanResend(false);
    setTimeLeft(300);
    setOtp(['', '', '', '', '', '']);
    setError('');
    
    try {
      // Simulate resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset timer
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get user data from localStorage for display
  const tempUserData = JSON.parse(localStorage.getItem('tempUserData') || '{}');

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-card">
        <div className="auth-header">
          <img src="/govt-logo.png" alt="Government Logo" className="govt-logo" />
          <h1>OTP Verification</h1>
          <p>Secure Communication Platform</p>
        </div>

        <div className="otp-verification-content">
          <div className="verification-info">
            <h2>Enter Verification Code</h2>
            <p>
              We've sent a 6-digit verification code to your registered mobile number 
              <strong> ****{tempUserData.mobileNumber?.slice(-4)}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={error ? 'error' : ''}
                  disabled={loading}
                  autoComplete="off"
                />
              ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="verify-btn"
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="otp-footer">
            {!canResend ? (
              <p className="timer">
                Resend OTP in <span className="time-left">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button 
                type="button" 
                className="resend-btn"
                onClick={handleResendOTP}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>

        <div className="security-notice">
          <p>🔒 Do not share this OTP with anyone. Valid for 5 minutes only.</p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;