import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './PhotoVerification.css';

const PhotoVerification = () => {
  const { login, nextAuthStep } = useAuth();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setError('');
    setUploadedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    if (!uploadedImage) {
      setError('Please upload your ID document photo');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const tempUserData = JSON.parse(localStorage.getItem('tempUserData') || '{}');
      const userData = {
        id: Date.now().toString(),
        specialId: tempUserData.specialId,
        mobileNumber: tempUserData.mobileNumber,
        department: tempUserData.department,
        designation: tempUserData.designation,
        name: `Officer ${tempUserData.specialId?.slice(-4)}`,
        profileImage: imagePreview,
        verifiedAt: new Date().toISOString(),
        status: 'verified'
      };
      localStorage.removeItem('tempUserData');
      login(userData);
    } catch (error) {
      setError('Photo verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const tempUserData = JSON.parse(localStorage.getItem('tempUserData') || '{}');

  return (
    <div className="photo-verification-container">
      <div className="photo-verification-card">
        <div className="auth-header">
          <img src="/govt-logo.png" alt="Government Logo" className="govt-logo" />
          <h1>ID Verification</h1>
          <p>Final Step - Document Upload</p>
        </div>

        <div className="photo-verification-content">
          <div className="verification-info">
            <h2>Upload ID Document</h2>
            <p>Please upload a clear photo of your government-issued ID document</p>
          </div>

          <form onSubmit={handleSubmit} className="photo-form">
            <div className="user-info">
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value">{tempUserData.specialId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Department:</span>
                <span className="info-value">{tempUserData.department}</span>
              </div>
            </div>

            <div 
              className={`upload-area ${dragOver ? 'drag-over' : ''} ${imagePreview ? 'has-image' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {!imagePreview ? (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <h3>Upload ID Photo</h3>
                  <p>Drag & drop your ID document or click to browse</p>
                  <div className="upload-requirements">
                    <small>• Clear, readable image</small>
                    <small>• JPEG, PNG format</small>
                    <small>• Max 5MB file size</small>
                  </div>
                </div>
              ) : (
                <div className="image-preview">
                  <img src={imagePreview} alt="ID Document Preview" />
                  <div className="image-overlay">
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />

            {error && <div className="error-message">{error}</div>}

            {!uploadedImage && (
              <div className="upload-hint">
                <p>📸 Please upload your ID document photo to proceed with verification.</p>
              </div>
            )}

            <button 
              type="submit" 
              className={`verify-btn ${loading ? 'loading' : ''}`}
              disabled={loading || !uploadedImage}
            >
              {loading ? (
                <span>
                  <span className="loading-spinner">⟳</span>
                  Verifying Document...
                </span>
              ) : uploadedImage ? (
                'Complete Verification'
              ) : (
                'Upload Image to Continue'
              )}
            </button>
          </form>

          <div className="verification-steps">
            <div className="step completed">
              <div className="step-icon">✓</div>
              <span>ID Verified</span>
            </div>
            <div className="step completed">
              <div className="step-icon">✓</div>
              <span>OTP Verified</span>
            </div>
            <div className="step active">
              <div className="step-icon">3</div>
              <span>Document Upload</span>
            </div>
          </div>
        </div>

        <div className="security-notice">
          <p>🔒 Your documents are processed securely and stored encrypted.</p>
        </div>
      </div>
    </div>
  );
};

export default PhotoVerification;