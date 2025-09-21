import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatMain from './ChatMain';
import './ChatLayout.css';const ChatLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats', 'groups', 'media', 'profile'
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [media, setMedia] = useState([]);

  // Mock online users data
  useEffect(() => {
    const mockUsers = [
      {
        id: '1',
        name: 'Agent Smith',
        department: 'Intelligence',
        status: 'online',
        lastSeen: new Date(),
        avatar: null
      },
      {
        id: '2',
        name: 'Officer Johnson',
        department: 'Security',
        status: 'online',
        lastSeen: new Date(),
        avatar: null
      },
      {
        id: '3',
        name: 'Commander Wilson',
        department: 'Defense',
        status: 'away',
        lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
        avatar: null
      },
      {
        id: '4',
        name: 'Detective Brown',
        department: 'Police',
        status: 'offline',
        lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
        avatar: null
      }
    ];
    setOnlineUsers(mockUsers);

    // Mock groups data
    const mockGroups = [
      {
        id: 'g1',
        name: 'Intelligence Task Force',
        members: 12,
        lastMessage: 'Operation status update',
        lastMessageTime: '2m ago',
        unread: 3,
        avatar: null
      },
      {
        id: 'g2',
        name: 'Security Operations',
        members: 8,
        lastMessage: 'Daily briefing complete',
        lastMessageTime: '15m ago',
        unread: 0,
        avatar: null
      },
      {
        id: 'g3',
        name: 'Emergency Response',
        members: 25,
        lastMessage: 'All clear on sector 7',
        lastMessageTime: '1h ago',
        unread: 1,
        avatar: null
      }
    ];
    setGroups(mockGroups);

    // Mock media data
    const mockMedia = [
      { id: 'm1', type: 'image', url: '/placeholder-image.jpg', sender: 'Agent Smith', timestamp: new Date() },
      { id: 'm2', type: 'document', name: 'mission-report.pdf', sender: 'Commander Wilson', timestamp: new Date(Date.now() - 3600000) },
      { id: 'm3', type: 'video', name: 'briefing-video.mp4', sender: 'Officer Johnson', timestamp: new Date(Date.now() - 7200000) }
    ];
    setMedia(mockMedia);
  }, []);

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    setShowChatList(false); // Hide chat list when selecting a chat
    setActiveTab('chats'); // Ensure we're on the chats tab
  };

  const handleBackToList = () => {
    // Clear active chat to go back to chat list
    setActiveChat(null);
    setShowChatList(true); // Show chat list when going back
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveChat(null); // Clear active chat when switching tabs
    setShowChatList(true); // Show chat list when switching tabs
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <ChatMain
            onlineUsers={onlineUsers}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            showChatList={showChatList}
            setShowChatList={setShowChatList}
            onChatSelect={handleChatSelect}
            onBack={handleBackToList}
            hasBottomNav={!activeChat}
          />
        );
      case 'groups':
        return (
          <div className="groups-tab">
            <div className="tab-header">
              <h2>Groups</h2>
            </div>
            <div className="groups-list">
              {groups.map(group => (
                <div key={group.id} className="group-item" onClick={() => handleChatSelect(group.id)}>
                  <div className="group-avatar">
                    <div className="group-icon">👥</div>
                    {group.unread > 0 && (
                      <div className="unread-badge">{group.unread}</div>
                    )}
                  </div>
                  <div className="group-info">
                    <div className="group-name">{group.name}</div>
                    <div className="group-meta">
                      <span className="group-members">{group.members} members</span>
                      <span className="group-time">{group.lastMessageTime}</span>
                    </div>
                    <div className="group-last-message">{group.lastMessage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="media-tab">
            <div className="tab-header">
              <h2>Media & Documents</h2>
            </div>
            <div className="media-list">
              {media.map(item => (
                <div key={item.id} className="media-item">
                  <div className="media-icon">
                    {item.type === 'image' && '📷'}
                    {item.type === 'document' && '📄'}
                    {item.type === 'video' && '🎥'}
                  </div>
                  <div className="media-info">
                    <div className="media-name">{item.name || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`}</div>
                    <div className="media-meta">
                      <span className="media-sender">From: {item.sender}</span>
                      <span className="media-time">{item.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="profile-tab">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h2>{user?.name}</h2>
                <p>{user?.department}</p>
                <p>{user?.email}</p>
              </div>
            </div>
            <div className="profile-actions">
              <button className="profile-action-btn" onClick={() => navigate('/profile')}>
                <span className="action-icon">⚙️</span>
                Settings
              </button>
              <button className="profile-action-btn" onClick={handleLogout}>
                <span className="action-icon">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="chat-layout">
      <div className="chat-header">
        <div className="header-left">
          <div className="header-title">
            <img src="/govt-logo.png" alt="Logo" className="header-logo" />
            <h1>SecureChat</h1>
          </div>
        </div>
      </div>

      {/* Chat-specific header - shows when individual chat is open */}
      {activeTab === 'chats' && activeChat && (
        <div className="chat-specific-header">
          <div className="chat-header-content">
            <button 
              className="chat-back-btn"
              onClick={handleBackToList}
              title="Back to chat list"
            >
              ←
            </button>
            <div className="chat-user-info">
              <div className="chat-user-avatar">
                {(() => {
                  const user = onlineUsers.find(u => u.id === activeChat);
                  return user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <div className="chat-avatar-placeholder">
                      {user?.name?.charAt(0) || '?'}
                    </div>
                  );
                })()}
                <div className="chat-status-dot" style={{ 
                  backgroundColor: (() => {
                    const user = onlineUsers.find(u => u.id === activeChat);
                    return user?.status === 'online' ? '#27ae60' : '#95a5a6';
                  })()
                }}></div>
              </div>
              <div className="chat-user-details">
                <h3>{(() => {
                  const user = onlineUsers.find(u => u.id === activeChat);
                  return user?.name || 'Unknown User';
                })()}</h3>
                <span className="chat-user-status">
                  {(() => {
                    const user = onlineUsers.find(u => u.id === activeChat);
                    return user?.status === 'online' ? 'Online' : 'Offline';
                  })()} • {(() => {
                    const user = onlineUsers.find(u => u.id === activeChat);
                    return user?.department || '';
                  })()}
                </span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="chat-action-btn" title="Video Call">📹</button>
              <button className="chat-action-btn" title="Voice Call">📞</button>
              <button className="chat-action-btn" title="More Options">⋯</button>
            </div>
          </div>
        </div>
      )}

      <div className={`chat-body ${activeTab === 'chats' && activeChat ? 'with-chat-header' : ''}`}>
        {renderTabContent()}
      </div>
      
      {/* Hide bottom navigation when in individual chat view */}
      {!(activeTab === 'chats' && activeChat) && (
        <div className="bottom-navigation">
          <button 
            className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => handleTabChange('chats')}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-label">Chats</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => handleTabChange('groups')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-label">Groups</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => handleTabChange('media')}
          >
            <span className="nav-icon">📁</span>
            <span className="nav-label">Media</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;