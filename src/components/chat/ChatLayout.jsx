// Updated ChatLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPhone, faEllipsis, faComments, faUsers, faImages, faUser, faTrash, faBellSlash, faSearch, faChevronRight, faArrowLeft, faSignOutAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import ChatMain from './ChatMain';
import './ChatLayoutNew.css';

const ChatLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats', 'groups', 'media', 'profile'
  const [showMoreOptions, setShowMoreOptions] = useState(false); // Dropdown state
  const [activeGroup, setActiveGroup] = useState(null); // Current active group
  const [showGroupList, setShowGroupList] = useState(true); // Show/hide group list
  const [showGroupMembers, setShowGroupMembers] = useState(false); // Show group members page
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'HQ',
      description: 'Headquarters Team',
      members: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      lastMessage: 'Meeting at 3 PM today',
      timestamp: '2 mins',
      avatar: '👥'
    },
    {
      id: 2,
      name: 'Family',
      description: 'Family Group',
      members: ['Mom', 'Dad', 'Sister', 'Brother'],
      lastMessage: 'Dinner tonight?',
      timestamp: '1 hour',
      avatar: '👨‍👩‍👧‍👦'
    },
    {
      id: 3,
      name: 'my-unit',
      description: 'My Unit Team',
      members: ['Alex Brown', 'Chris Davis', 'Emma Taylor', 'David Miller', 'Lisa Anderson'],
      lastMessage: 'Project deadline tomorrow',
      timestamp: '30 mins',
      avatar: '🔧'
    }
  ]);
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

  // Fix for mobile viewport height issues (dynamic address bar, zoom consistency)
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
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

  const handleVideoCall = () => {
    if (activeChat) {
      const user = onlineUsers.find(u => u.id === activeChat);
      const userName = user?.name || 'User';
      
      if (window.confirm(`Start video call with ${userName}?`)) {
        console.log(`Initiating video call with ${userName}`);
        // Here you would integrate with your video calling service
        alert(`Video call feature would be implemented here for ${userName}`);
      }
    }
  };

  const handleVoiceCall = () => {
    if (activeChat) {
      const user = onlineUsers.find(u => u.id === activeChat);
      const userName = user?.name || 'User';
      
      if (window.confirm(`Start voice call with ${userName}?`)) {
        console.log(`Initiating voice call with ${userName}`);
        // Here you would integrate with your voice calling service
        alert(`Voice call feature would be implemented here for ${userName}`);
      }
    }
  };

  const handleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  // Group-specific handlers
  const handleGroupSelect = (group) => {
    setActiveGroup(group);
    setShowGroupList(false);
    setActiveTab('groups'); // Keep tab as groups but show specific group
  };

  const handleBackToGroups = () => {
    setActiveGroup(null);
    setShowGroupList(true);
    setShowGroupMembers(false);
  };

  const handleShowGroupMembers = () => {
    setShowGroupMembers(true);
  };

  const handleLeaveGroup = () => {
    console.log('Leaving group:', activeGroup?.name);
    // Add leave group logic here
  };

  const handleBackFromMembers = () => {
    setShowGroupMembers(false);
  };

  const handleDeleteChat = () => {
    if (activeChat && window.confirm('Are you sure you want to delete this chat?')) {
      const user = onlineUsers.find(u => u.id === activeChat);
      const userName = user?.name || 'User';
      console.log(`Deleting chat with ${userName}`);
      // Here you would implement the delete chat functionality
      alert(`Chat with ${userName} would be deleted`);
      setShowMoreOptions(false);
    }
  };

  const handleMuteNotifications = () => {
    if (activeChat) {
      const user = onlineUsers.find(u => u.id === activeChat);
      const userName = user?.name || 'User';
      console.log(`Muting notifications for ${userName}`);
      // Here you would implement the mute notifications functionality
      alert(`Notifications for ${userName} would be muted`);
      setShowMoreOptions(false);
    }
  };

  const handleSearchChat = () => {
    console.log('Opening chat search');
    // Here you would implement the search functionality
    alert('Chat search functionality would be implemented here');
    setShowMoreOptions(false);
  };

  const handleMoreOptionsSubmenu = () => {
    console.log('Opening more options submenu');
    // Here you would implement additional options
    alert('Additional options submenu would be implemented here');
    setShowMoreOptions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMoreOptions && !event.target.closest('.more-options-container')) {
        setShowMoreOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreOptions]);

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
        if (showGroupMembers) {
          // Show group members page
          return (
            <div className="group-members-page">
              <div className="group-members-header">
                <button className="back-btn" onClick={handleBackFromMembers}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h2>{activeGroup?.name} Members</h2>
              </div>
              <div className="members-list">
                {activeGroup?.members.map((member, index) => (
                  <div key={index} className="member-item">
                    <div className="member-avatar">
                      <div className="member-icon">👤</div>
                    </div>
                    <div className="member-info">
                      <div className="member-name">{member}</div>
                      <div className="member-status">Online</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        } else if (activeGroup && !showGroupList) {
          // Show specific group chat view
          return (
            <div className="group-specific-view">
              {/* Group chat content would go here - similar to ChatMain but for groups */}
              <div className="group-chat-header">
                <button className="back-btn" onClick={handleBackToGroups}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <div className="group-info">
                  <h2>{activeGroup.name}</h2>
                  <p>{activeGroup.members.length} members</p>
                </div>
                <div className="group-actions">
                  <button className="chat-action-btn video-call-btn" onClick={handleVideoCall}>
                    <FontAwesomeIcon icon={faVideo} />
                  </button>
                  <button className="chat-action-btn voice-call-btn" onClick={handleVoiceCall}>
                    <FontAwesomeIcon icon={faPhone} />
                  </button>
                  <div className="more-options-container">
                    <button className="chat-action-btn more-options-btn" onClick={handleMoreOptions}>
                      <FontAwesomeIcon icon={faEllipsis} />
                    </button>
                    {showMoreOptions && (
                      <div className="more-options-dropdown">
                        <button className="dropdown-item" onClick={handleDeleteChat}>
                          <FontAwesomeIcon icon={faTrash} />
                          <span>Delete Chat</span>
                        </button>
                        <button className="dropdown-item" onClick={handleMuteNotifications}>
                          <FontAwesomeIcon icon={faBellSlash} />
                          <span>Mute Notifications</span>
                        </button>
                        <button className="dropdown-item" onClick={handleSearchChat}>
                          <FontAwesomeIcon icon={faSearch} />
                          <span>Search</span>
                        </button>
                        <button className="dropdown-item" onClick={handleShowGroupMembers}>
                          <FontAwesomeIcon icon={faUserFriends} />
                          <span>Members</span>
                        </button>
                        <button className="dropdown-item" onClick={handleLeaveGroup}>
                          <FontAwesomeIcon icon={faSignOutAlt} />
                          <span>Exit Group</span>
                        </button>
                        <button className="dropdown-item" onClick={handleMoreOptionsSubmenu}>
                          <span>More Options</span>
                          <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="group-messages">
                <div className="messages-list">
                  <div className="message received">
                    <div className="message-content">
                      <div className="message-header">
                        <span className="sender-name">John</span>
                        <span className="message-time">2 mins</span>
                      </div>
                      <div className="message-text">{activeGroup.lastMessage}</div>
                    </div>
                  </div>
                  <div className="message sent">
                    <div className="message-content">
                      <div className="message-header">
                        <span className="sender-name">You</span>
                        <span className="message-time">1 min</span>
                      </div>
                      <div className="message-text">Got it, thanks!</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group-message-input">
                <div className="input-wrapper">
                  <input type="text" placeholder={`Message ${activeGroup.name}`} />
                </div>
                <button className="send-btn">
                  ➤
                </button>
              </div>
            </div>
          );
        } else {
          // Show groups list
          return (
            <div className="groups-tab">
              <div className="tab-header">
                <h2>Groups</h2>
              </div>
              <div className="groups-list">
                {groups.map(group => (
                  <div key={group.id} className="group-item" onClick={() => handleGroupSelect(group)}>
                    <div className="group-avatar">
                      <div className="group-icon">{group.avatar}</div>
                    </div>
                    <div className="group-info">
                      <div className="group-name">{group.name}</div>
                      <div className="group-meta">
                        <span className="group-members">{group.members.length} members</span>
                        <span className="group-time">{group.timestamp}</span>
                      </div>
                      <div className="group-last-message">{group.lastMessage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
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
            <h1>Aegis</h1>
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
              <FontAwesomeIcon icon={faArrowLeft} />
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
              <button 
                className="chat-action-btn video-call-btn" 
                title="Video Call"
                onClick={handleVideoCall}
              >
                <FontAwesomeIcon icon={faVideo} />
              </button>
              <button 
                className="chat-action-btn voice-call-btn" 
                title="Voice Call"
                onClick={handleVoiceCall}
              >
                <FontAwesomeIcon icon={faPhone} />
              </button>
              <div className="more-options-container">
                <button 
                  className="chat-action-btn more-options-btn" 
                  title="More Options"
                  onClick={handleMoreOptions}
                >
                  <FontAwesomeIcon icon={faEllipsis} />
                </button>
                {showMoreOptions && (
                  <div className="more-options-dropdown">
                    <button className="dropdown-item" onClick={handleDeleteChat}>
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Delete Chat</span>
                    </button>
                    <button className="dropdown-item" onClick={handleMuteNotifications}>
                      <FontAwesomeIcon icon={faBellSlash} />
                      <span>Mute Notifications</span>
                    </button>
                    <button className="dropdown-item" onClick={handleSearchChat}>
                      <FontAwesomeIcon icon={faSearch} />
                      <span>Search</span>
                    </button>
                    <button className="dropdown-item" onClick={handleMoreOptionsSubmenu}>
                      <span>More Options</span>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`chat-body ${activeTab === 'chats' && activeChat ? 'with-chat-header' : ''} ${activeTab === 'groups' && activeGroup && !showGroupList ? 'with-group-chat' : ''}`}>
        {renderTabContent()}
      </div>
      
      {/* Hide bottom navigation when in individual chat view or group-specific view */}
      {!(activeTab === 'chats' && activeChat) && 
       !(activeTab === 'groups' && (activeGroup && !showGroupList)) && 
       !showGroupMembers && (
        <div className="bottom-navigation">
          <button 
            className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => handleTabChange('chats')}
          >
            <span className="nav-icon"><FontAwesomeIcon icon={faComments} /></span>
            <span className="nav-label">Chats</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => handleTabChange('groups')}
          >
            <span className="nav-icon"><FontAwesomeIcon icon={faUsers} /></span>
            <span className="nav-label">Groups</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => handleTabChange('media')}
          >
            <span className="nav-icon"><FontAwesomeIcon icon={faImages} /></span>
            <span className="nav-label">Media</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <span className="nav-icon"><FontAwesomeIcon icon={faUser} /></span>
            <span className="nav-label">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;