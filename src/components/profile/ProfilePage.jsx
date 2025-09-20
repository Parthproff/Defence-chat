import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate('/chat');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-button" onClick={handleGoBack}>
            <span className="back-icon">←</span>
            Back to Chat
          </button>
          <h1>Profile Details</h1>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="profile-avatar">
              {user.photo ? (
                <img src={user.photo} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-placeholder">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>

            <div className="profile-info">
              <div className="info-group">
                <label>Full Name</label>
                <div className="info-value">{user.name || 'Not provided'}</div>
              </div>

              <div className="info-group">
                <label>Authority ID</label>
                <div className="info-value">{user.authorityId || 'Not provided'}</div>
              </div>

              <div className="info-group">
                <label>Phone Number</label>
                <div className="info-value">{user.phone || 'Not provided'}</div>
              </div>

              <div className="info-group">
                <label>Department</label>
                <div className="info-value">{user.department || 'General Authority'}</div>
              </div>

              <div className="info-group">
                <label>Status</label>
                <div className="info-value">
                  <span className="status-badge active">Active</span>
                </div>
              </div>

              <div className="info-group">
                <label>Last Login</label>
                <div className="info-value">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="action-button primary" onClick={handleGoBack}>
              Return to Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;