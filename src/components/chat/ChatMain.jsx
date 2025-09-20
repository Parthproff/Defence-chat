import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ChatMain.css';

const ChatMain = ({ activeChat, onlineUsers, sidebarOpen }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  const activeChatUser = onlineUsers.find(u => u.id === activeChat);

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

  if (!activeChat) {
    return (
      <div className={`chat-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="no-chat-selected">
          <div className="no-chat-content">
            <div className="no-chat-icon">💬</div>
            <h2>SecureChat</h2>
            <p>Select a user or group to start a secure conversation</p>
            <div className="security-features">
              <div className="feature-item">🔐 End-to-end encryption</div>
              <div className="feature-item">🛡️ Government-grade security</div>
              <div className="feature-item">📝 Message logging for compliance</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="chat-header-bar">
        <div className="chat-contact-info">
          <div className="contact-avatar">
            {activeChatUser?.avatar ? (
              <img src={activeChatUser.avatar} alt={activeChatUser.name} />
            ) : (
              <div className="avatar-placeholder">
                {activeChatUser?.name?.charAt(0) || '?'}
              </div>
            )}
            <div 
              className="status-dot"
              style={{ backgroundColor: activeChatUser?.status === 'online' ? '#27ae60' : '#95a5a6' }}
            ></div>
          </div>
          <div className="contact-details">
            <h3>{activeChatUser?.name}</h3>
            <span className="contact-status">
              {activeChatUser?.status === 'online' ? 'Online' : 'Offline'} • {activeChatUser?.department}
            </span>
          </div>
        </div>
        
        <div className="chat-actions">
          <button className="action-btn" title="Video Call">📹</button>
          <button className="action-btn" title="Voice Call">📞</button>
          <button className="action-btn" title="More Options">⋯</button>
        </div>
      </div>

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