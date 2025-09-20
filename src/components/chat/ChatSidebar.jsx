import React, { useState } from 'react';
import './ChatSidebar.css';

const ChatSidebar = ({ isOpen, onlineUsers, activeChat, onChatSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'groups'

  const filteredUsers = onlineUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#27ae60';
      case 'away': return '#f39c12';
      case 'offline': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const formatLastSeen = (lastSeen) => {
    const now = new Date();
    const diff = now - new Date(lastSeen);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const mockGroups = [
    {
      id: 'g1',
      name: 'Intelligence Task Force',
      members: 12,
      lastMessage: 'Operation status update',
      lastMessageTime: '2m ago',
      unread: 3
    },
    {
      id: 'g2',
      name: 'Security Operations',
      members: 8,
      lastMessage: 'Daily briefing complete',
      lastMessageTime: '15m ago',
      unread: 0
    },
    {
      id: 'g3',
      name: 'Emergency Response',
      members: 25,
      lastMessage: 'All clear on sector 7',
      lastMessageTime: '1h ago',
      unread: 1
    }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users or groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sidebar-tabs">
            <button
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({onlineUsers.filter(u => u.status === 'online').length})
            </button>
            <button
              className={`tab-button ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              Groups ({mockGroups.length})
            </button>
          </div>
        </div>

        <div className="sidebar-content">
          {activeTab === 'users' && (
            <div className="users-list">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={`user-item ${activeChat === user.id ? 'active' : ''}`}
                  onClick={() => onChatSelect(user.id)}
                >
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div 
                      className="status-indicator"
                      style={{ backgroundColor: getStatusColor(user.status) }}
                    ></div>
                  </div>
                  
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-meta">
                      <span className="user-department">{user.department}</span>
                      <span className="user-status">
                        {user.status === 'online' 
                          ? getStatusText(user.status)
                          : formatLastSeen(user.lastSeen)
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="empty-state">
                  <p>No users found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="groups-list">
              {mockGroups.map(group => (
                <div
                  key={group.id}
                  className={`group-item ${activeChat === group.id ? 'active' : ''}`}
                  onClick={() => onChatSelect(group.id)}
                >
                  <div className="group-avatar">
                    <div className="group-icon">👥</div>
                    {group.unread > 0 && (
                      <div className="unread-badge">{group.unread}</div>
                    )}
                  </div>
                  
                  <div className="group-info">
                    <div className="group-header">
                      <span className="group-name">{group.name}</span>
                      <span className="group-time">{group.lastMessageTime}</span>
                    </div>
                    <div className="group-meta">
                      <span className="group-members">{group.members} members</span>
                      <div className="group-last-message">{group.lastMessage}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;