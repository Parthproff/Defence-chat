class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
    this.messageQueue = [];
  }

  connect(userId) {
    // Since we don't have a real backend, we'll simulate WebSocket behavior
    this.simulateConnection(userId);
  }

  simulateConnection(userId) {
    console.log(`Simulating WebSocket connection for user: ${userId}`);
    
    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      this.emit('connected', { userId });
      
      // Start simulating incoming messages
      this.simulateIncomingMessages();
      
      // Process any queued messages
      this.processMessageQueue();
    }, 1000);

    // Simulate connection events
    this.simulateConnectionEvents();
  }

  simulateConnectionEvents() {
    // Simulate periodic connection status updates
    setInterval(() => {
      if (this.isConnected) {
        this.emit('heartbeat', { timestamp: new Date() });
      }
    }, 30000); // Every 30 seconds

    // Simulate occasional disconnections for testing
    setTimeout(() => {
      if (Math.random() < 0.1) { // 10% chance
        this.simulateDisconnect();
      }
    }, 60000); // After 1 minute
  }

  simulateDisconnect() {
    this.isConnected = false;
    this.emit('disconnected');
    
    // Auto-reconnect after a delay
    setTimeout(() => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.simulateConnection();
      }
    }, 3000);
  }

  simulateIncomingMessages() {
    // Simulate random incoming messages
    const mockMessages = [
      { type: 'user_status', userId: '1', status: 'online' },
      { type: 'user_status', userId: '2', status: 'away' },
      { type: 'typing_start', userId: '1', chatId: 'current' },
      { type: 'typing_stop', userId: '1', chatId: 'current' }
    ];

    const sendRandomMessage = () => {
      if (this.isConnected && Math.random() < 0.3) { // 30% chance
        const message = mockMessages[Math.floor(Math.random() * mockMessages.length)];
        this.emit('message', message);
      }
    };

    // Send random messages every 10-30 seconds
    setInterval(sendRandomMessage, 10000 + Math.random() * 20000);
  }

  disconnect() {
    this.isConnected = false;
    this.emit('disconnected');
    console.log('WebSocket disconnected');
  }

  sendMessage(data) {
    if (this.isConnected) {
      // Simulate message sending
      console.log('Sending message:', data);
      
      // Simulate server acknowledgment
      setTimeout(() => {
        this.emit('message_sent', {
          ...data,
          id: `msg_${Date.now()}`,
          timestamp: new Date(),
          status: 'delivered'
        });
      }, 100 + Math.random() * 500);
      
      return true;
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(data);
      return false;
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods for common actions
  joinRoom(roomId) {
    this.sendMessage({
      type: 'join_room',
      roomId
    });
  }

  leaveRoom(roomId) {
    this.sendMessage({
      type: 'leave_room',
      roomId
    });
  }

  sendChatMessage(chatId, message, type = 'text') {
    return this.sendMessage({
      type: 'chat_message',
      chatId,
      message,
      messageType: type
    });
  }

  sendTypingIndicator(chatId, isTyping) {
    this.sendMessage({
      type: isTyping ? 'typing_start' : 'typing_stop',
      chatId
    });
  }

  updateUserStatus(status) {
    this.sendMessage({
      type: 'user_status_update',
      status
    });
  }

  // Connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;