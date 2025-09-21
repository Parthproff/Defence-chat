import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './IdVerification.css';

const IdVerification = () => {
  const { nextAuthStep } = useAuth();
  const [formData, setFormData] = useState({
    specialId: '',
    mobileNumber: '',
    department: '',
    designation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.specialId.trim()) {
      newErrors.specialId = 'Special Security ID is required';
    } else if (formData.specialId.length < 10) {
      newErrors.specialId = 'Special Security ID must be at least 10 characters';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call for ID verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store form data for next steps
      localStorage.setItem('tempUserData', JSON.stringify(formData));
      
      // Move to OTP verification step
      nextAuthStep('otp-verification');
    } catch (error) {
      setErrors({ submit: 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="id-verification-container">
      <div className="id-verification-card">
        <div className="auth-header">
          <img src="/govt-logo.png" alt="Government Logo" className="govt-logo" />
          <h1>Government Authority Access</h1>
          <p>Secure Communication Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="id-verification-form">
          <h2>Identity Verification</h2>
          <p className="form-subtitle">Enter your government-issued credentials</p>

          <div className="form-group">
            <label htmlFor="specialId">Special Security ID *</label>
            <input
              type="text"
              id="specialId"
              name="specialId"
              value={formData.specialId}
              onChange={handleInputChange}
              placeholder="Enter your special security ID"
              className={errors.specialId ? 'error' : ''}
              disabled={loading}
            />
            {errors.specialId && <span className="error-message">{errors.specialId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Registered Mobile Number *</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter registered mobile number"
              className={errors.mobileNumber ? 'error' : ''}
              disabled={loading}
            />
            {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={errors.department ? 'error' : ''}
                disabled={loading}
              >
                <option value="">Select Department</option>
                <option value="defense">Defense</option>
                <option value="intelligence">Intelligence</option>
                <option value="security">Internal Security</option>
                <option value="police">Police</option>
                <option value="customs">Customs</option>
                <option value="immigration">Immigration</option>
                <option value="other">Other</option>
              </select>
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation *</label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Your designation"
                className={errors.designation ? 'error' : ''}
                disabled={loading}
              />
              {errors.designation && <span className="error-message">{errors.designation}</span>}
            </div>
          </div>

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          <div className="button-container">
            <button 
              type="submit" 
              className={`verify-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="loading-spinner">⟳</span>
                  Verifying...
                </span>
              ) : (
                'Verify Identity'
              )}
            </button>
          </div>
        </form>

        <div className="form-progress">
          <div className="progress-step active">
            <span className="step-number">1</span>
            <span className="step-label">Identity</span>
          </div>
          <div className="progress-step">
            <span className="step-number">2</span>
            <span className="step-label">OTP</span>
          </div>
          <div className="progress-step">
            <span className="step-number">3</span>
            <span className="step-label">Photo</span>
          </div>
        </div>

        <div className="security-notice">
          <p>🔒 This is a secure government platform. All activities are monitored and logged.</p>
        </div>
      </div>
    </div>
  );
};

export default IdVerification;