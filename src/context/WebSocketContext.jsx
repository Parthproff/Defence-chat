import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import webSocketService from '../services/webSocketService';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [unreadMessages, setUnreadMessages] = useState(new Map());

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setConnectionStatus('connecting');
      webSocketService.connect(user.id);
    } else {
      webSocketService.disconnect();
      setConnectionStatus('disconnected');
    }

    return () => {
      webSocketService.disconnect();
    };
  }, [isAuthenticated, user]);

  // WebSocket event handlers
  useEffect(() => {
    const handleConnected = () => {
      setConnectionStatus('connected');
      console.log('WebSocket connected successfully');
    };

    const handleDisconnected = () => {
      setConnectionStatus('disconnected');
      console.log('WebSocket disconnected');
    };

    const handleMessage = (data) => {
      switch (data.type) {
        case 'user_status':
          setOnlineUsers(prev => {
            const newMap = new Map(prev);
            newMap.set(data.userId, data.status);
            return newMap;
          });
          break;

        case 'typing_start':
          setTypingUsers(prev => {
            const newMap = new Map(prev);
            newMap.set(data.userId, true);
            return newMap;
          });
          break;

        case 'typing_stop':
          setTypingUsers(prev => {
            const newMap = new Map(prev);
            newMap.delete(data.userId);
            return newMap;
          });
          break;

        case 'chat_message':
          // Handle incoming chat messages
          handleIncomingMessage(data);
          break;

        case 'message_delivered':
          // Handle message delivery confirmation
          console.log('Message delivered:', data.messageId);
          break;

        default:
          console.log('Unknown WebSocket message type:', data.type);
      }
    };

    const handleMessageSent = (data) => {
      console.log('Message sent successfully:', data);
    };

    const handleHeartbeat = (data) => {
      // Connection is alive
      setConnectionStatus('connected');
    };

    // Attach event listeners
    webSocketService.on('connected', handleConnected);
    webSocketService.on('disconnected', handleDisconnected);
    webSocketService.on('message', handleMessage);
    webSocketService.on('message_sent', handleMessageSent);
    webSocketService.on('heartbeat', handleHeartbeat);

    // Cleanup event listeners
    return () => {
      webSocketService.off('connected', handleConnected);
      webSocketService.off('disconnected', handleDisconnected);
      webSocketService.off('message', handleMessage);
      webSocketService.off('message_sent', handleMessageSent);
      webSocketService.off('heartbeat', handleHeartbeat);
    };
  }, []);

  const handleIncomingMessage = useCallback((messageData) => {
    // Add to unread messages if not in active chat
    setUnreadMessages(prev => {
      const newMap = new Map(prev);
      const chatId = messageData.chatId;
      const count = newMap.get(chatId) || 0;
      newMap.set(chatId, count + 1);
      return newMap;
    });

    // Emit custom event for components to listen to
    window.dispatchEvent(new CustomEvent('newMessage', { detail: messageData }));
  }, []);

  const sendMessage = useCallback((chatId, message, type = 'text') => {
    if (connectionStatus !== 'connected') {
      console.warn('Cannot send message: WebSocket not connected');
      return false;
    }

    return webSocketService.sendChatMessage(chatId, message, type);
  }, [connectionStatus]);

  const sendTypingIndicator = useCallback((chatId, isTyping) => {
    if (connectionStatus === 'connected') {
      webSocketService.sendTypingIndicator(chatId, isTyping);
    }
  }, [connectionStatus]);

  const markMessagesAsRead = useCallback((chatId) => {
    setUnreadMessages(prev => {
      const newMap = new Map(prev);
      newMap.delete(chatId);
      return newMap;
    });
  }, []);

  const updateUserStatus = useCallback((status) => {
    if (connectionStatus === 'connected') {
      webSocketService.updateUserStatus(status);
    }
  }, [connectionStatus]);

  const joinRoom = useCallback((roomId) => {
    if (connectionStatus === 'connected') {
      webSocketService.joinRoom(roomId);
    }
  }, [connectionStatus]);

  const leaveRoom = useCallback((roomId) => {
    if (connectionStatus === 'connected') {
      webSocketService.leaveRoom(roomId);
    }
  }, [connectionStatus]);

  const getConnectionInfo = () => ({
    status: connectionStatus,
    isConnected: connectionStatus === 'connected',
    reconnectAttempts: webSocketService.getConnectionStatus().reconnectAttempts
  });

  const value = {
    // Connection state
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    
    // User states
    onlineUsers,
    typingUsers,
    unreadMessages,
    
    // Actions
    sendMessage,
    sendTypingIndicator,
    markMessagesAsRead,
    updateUserStatus,
    joinRoom,
    leaveRoom,
    
    // Utilities
    getConnectionInfo
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};