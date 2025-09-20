import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ChatMain.css';

const ChatMain = ({ 
  onlineUsers, 
  activeChat, 
  setActiveChat, 
  showChatList, 
  setShowChatList, 
  onChatSelect, 
  onBack, 
  hasBottomNav = true 
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const activeChatUser = onlineUsers.find(u => u.id === activeChat);

  // Check if it's mobile view
  const isMobile = window.innerWidth <= 768;

  // Mock messages data
  useEffect(() => {
    const mockMessages = {
      '1': [
        {
          id: 'm1',
          senderId: '1',
          senderName: 'Agent Smith',
          content: 'Operation status update required.',
          timestamp: new Date(Date.now() - 600000), // 10 minutes ago
          type: 'text'
        },
        {
          id: 'm2',
          senderId: user.id,
          senderName: user.name,
          content: 'Roger that. All systems operational in sector 4.',
          timestamp: new Date(Date.now() - 540000), // 9 minutes ago
          type: 'text'
        },
        {
          id: 'm3',
          senderId: '1',
          senderName: 'Agent Smith',
          content: 'Confirmed. Proceed with next phase.',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          type: 'text'
        }
      ],
      '2': [
        {
          id: 'm4',
          senderId: '2',
          senderName: 'Officer Johnson',
          content: 'Security briefing at 1400 hours.',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          type: 'text'
        },
        {
          id: 'm5',
          senderId: user.id,
          senderName: user.name,
          content: 'Acknowledged. Will be there.',
          timestamp: new Date(Date.now() - 3540000), // 59 minutes ago
          type: 'text'
        }
      ]
    };
    setMessages(mockMessages);
  }, [user.id, user.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: `m${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      content: message.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage]
    }));

    setMessage('');
    messageInputRef.current?.focus();

    // Simulate response after a delay
    setTimeout(() => {
      if (activeChatUser) {
        const responseMessage = {
          id: `m${Date.now() + 1}`,
          senderId: activeChat,
          senderName: activeChatUser.name,
          content: getRandomResponse(),
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => ({
          ...prev,
          [activeChat]: [...(prev[activeChat] || []), responseMessage]
        }));
      }
    }, 1000 + Math.random() * 2000);
  };

  const getRandomResponse = () => {
    const responses = [
      'Understood.',
      'Copy that.',
      'Roger.',
      'Message received and confirmed.',
      'Will proceed as instructed.',
      'Status confirmed.',
      'Acknowledged.',
      'Standing by for further instructions.',
      'Confirmed and logged.',
      'Message clear.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatMessageTime = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageDate) / 60000);

    if (diffInMinutes < 1) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return messageDate.toLocaleDateString();
  };

  const currentMessages = messages[activeChat] || [];

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#27ae60';
      case 'away': return '#f39c12';
      case 'offline': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  // Helper function to format last seen time
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

  // Always show individual chat view when activeChat is set
  if (!activeChat) {
    // Show the chat list when no active chat is selected
    return (
      <div className={`chat-main ${hasBottomNav ? 'with-bottom-nav' : ''}`}>
        <div className="chat-list">
          <div className="chat-list-header">
            <h2>Chats</h2>
          </div>
          <div className="users-list">
            {onlineUsers.map(user => (
              <div
                key={user.id}
                className="user-item"
                onClick={() => onChatSelect && onChatSelect(user.id)}
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
                        ? 'Online'
                        : formatLastSeen(user.lastSeen)
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-main ${hasBottomNav ? 'with-bottom-nav' : ''}`}>
      <div className="messages-container">
        <div className="messages-list">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="sender-name">{msg.senderName}</span>
                  <span className="message-time">{formatMessageTime(msg.timestamp)}</span>
                </div>
                <div className="message-text">{msg.content}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message received">
              <div className="message-content typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-wrapper">
            <button type="button" className="attachment-btn" title="Attach File">📎</button>
            <input
              ref={messageInputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a secure message..."
              className="message-input"
              maxLength={500}
            />
            <button type="button" className="emoji-btn" title="Add Emoji">😊</button>
          </div>
          <button 
            type="submit" 
            className="send-btn"
            disabled={!message.trim()}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatMain;