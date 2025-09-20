import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatSidebar from './ChatSidebar';
import ChatMain from './ChatMain';
import './ChatLayout.css';

const ChatLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
  }, []);

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    // On mobile, close sidebar when chat is selected
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUserMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('User menu clicked, current state:', showUserMenu);
    setShowUserMenu(!showUserMenu);
    console.log('New menu state:', !showUserMenu);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Profile button clicked');
    setShowUserMenu(false);
    navigate('/profile');
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Logout clicked!');
    setShowUserMenu(false);
    console.log('Executing logout...');
    logout();
    console.log('Navigating to auth...');
    // Small delay to ensure state is cleared before navigation
    setTimeout(() => {
      navigate('/auth');
    }, 100);
  };

  return (
    <div className="chat-layout">
      <div className="chat-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="header-title">
            <img src="/govt-logo.png" alt="Logo" className="header-logo" />
            <h1>SecureChat</h1>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-info" onClick={handleUserMenuClick}>
            <div className="user-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-dept">{user?.department}</span>
            </div>
            <span className="user-menu-arrow" onClick={handleUserMenuClick}>▼</span>
          </div>
          
          {showUserMenu && (
            <div className="user-dropdown">
              <button className="dropdown-item" onClick={handleProfileClick}>
                👤 Profile
              </button>
              <button className="dropdown-item" onClick={handleLogoutClick}>
                ⊗ Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="chat-body">
        <ChatSidebar 
          isOpen={sidebarOpen}
          onlineUsers={onlineUsers}
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
          onClose={() => setSidebarOpen(false)}
        />
        
        <ChatMain 
          activeChat={activeChat}
          onlineUsers={onlineUsers}
          sidebarOpen={sidebarOpen}
        />
      </div>
      
      {showUserMenu && (
        <div className="user-menu-overlay" onClick={() => setShowUserMenu(false)}></div>
      )}
    </div>
  );
};

export default ChatLayout;