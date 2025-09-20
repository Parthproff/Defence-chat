import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const { connectionStatus, getConnectionInfo } = useWebSocket();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
    department: user?.department || ''
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Add a small delay to show feedback
    setTimeout(() => {
      logout();
      navigate('/auth');
    }, 1000);
  };

  const connectionInfo = getConnectionInfo();

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes (in a real app, this would make an API call)
      console.log('Saving profile changes:', editForm);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return '#27ae60';
      case 'connecting': return '#f39c12';
      case 'disconnected': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  const formatVerificationDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="user-profile-container">
      <div className="profile-navigation">
        <button 
          className="back-btn"
          onClick={() => navigate('/chat')}
        >
          ← Back to Chat
        </button>
        <h1 className="page-title">User Profile</h1>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p className="profile-designation">{user?.designation}</p>
          <p className="profile-department">{user?.department}</p>
          <div className="connection-status">
            <div 
              className="status-indicator"
              style={{ backgroundColor: getStatusColor(connectionStatus) }}
            ></div>
            <span>{getStatusText(connectionStatus)}</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="section-header">
              <h3>Personal Information</h3>
              <button className="edit-btn" onClick={handleEditToggle}>
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>

            <div className="profile-fields">
              <div className="field-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span className="field-value">{user?.name}</span>
                )}
              </div>

              <div className="field-group">
                <label>Special Security ID</label>
                <span className="field-value">{user?.specialId}</span>
              </div>

              <div className="field-group">
                <label>Department</label>
                {isEditing ? (
                  <select
                    name="department"
                    value={editForm.department}
                    onChange={handleInputChange}
                  >
                    <option value="defense">Defense</option>
                    <option value="intelligence">Intelligence</option>
                    <option value="security">Internal Security</option>
                    <option value="police">Police</option>
                    <option value="customs">Customs</option>
                    <option value="immigration">Immigration</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span className="field-value">{user?.department}</span>
                )}
              </div>

              <div className="field-group">
                <label>Designation</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="designation"
                    value={editForm.designation}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span className="field-value">{user?.designation}</span>
                )}
              </div>

              <div className="field-group">
                <label>Mobile Number</label>
                <span className="field-value">{user?.mobileNumber}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="security-tab">
            <h3>Security Information</h3>
            
            <div className="security-info">
              <div className="info-card">
                <h4>Verification Status</h4>
                <div className="status-item">
                  <span className="status-label">Account Status:</span>
                  <span className="status-value verified">✓ Verified</span>
                </div>
                <div className="status-item">
                  <span className="status-label">ID Verification:</span>
                  <span className="status-value verified">✓ Completed</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Verified On:</span>
                  <span className="status-value">{formatVerificationDate(user?.verifiedAt)}</span>
                </div>
              </div>

              <div className="info-card">
                <h4>Connection Security</h4>
                <div className="status-item">
                  <span className="status-label">Encryption:</span>
                  <span className="status-value verified">🔒 End-to-End</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Connection:</span>
                  <span className="status-value verified">🛡️ TLS 1.3</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Session:</span>
                  <span className="status-value verified">🔑 Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h3>Application Settings</h3>
            
            <div className="settings-section">
              <h4>Connection Information</h4>
              <div className="connection-details">
                <div className="detail-item">
                  <span>Status:</span>
                  <span style={{ color: getStatusColor(connectionStatus) }}>
                    {getStatusText(connectionStatus)}
                  </span>
                </div>
                <div className="detail-item">
                  <span>Reconnect Attempts:</span>
                  <span>{connectionInfo.reconnectAttempts}</span>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h4>Session Management</h4>
              <button 
                className="logout-btn-full" 
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '🔄 Signing Out...' : 'Sign Out'}
              </button>
              <p className="logout-note">
                This will end your current session and require re-authentication.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;