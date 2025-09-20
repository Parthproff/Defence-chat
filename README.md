# Government Authority Chat Application

A secure React-based chat application designed for government authority personnel with multi-step authentication and real-time communication capabilities.

## 🚀 Features

### Authentication System
- **Special ID Verification**: Government-issued security ID validation
- **OTP Verification**: SMS-based one-time password authentication
- **Photo Verification**: ID document upload and verification
- **Persistent Sessions**: Secure session management with localStorage

### Chat Interface
- **Real-time Messaging**: WebSocket-based instant communication
- **User Presence**: Online/offline status indicators
- **Group Chats**: Department-based group conversations
- **Message History**: Persistent chat history
- **Typing Indicators**: Real-time typing status

### Security Features
- **End-to-end Encryption** (simulated)
- **Government-grade Security** protocols
- **Session Monitoring** and logging
- **Secure File Sharing** capabilities

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM
- **Styling**: Pure CSS (no frameworks)
- **State Management**: React Context API
- **Real-time**: WebSocket (simulated)
- **Authentication**: Multi-step verification flow

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthWrapper.jsx
│   │   ├── IdVerification.jsx
│   │   ├── OtpVerification.jsx
│   │   └── PhotoVerification.jsx
│   ├── chat/
│   │   ├── ChatLayout.jsx
│   │   ├── ChatSidebar.jsx
│   │   └── ChatMain.jsx
│   ├── ProtectedRoute.jsx
│   └── UserProfile.jsx
├── context/
│   ├── AuthContext.jsx
│   └── WebSocketContext.jsx
├── services/
│   └── webSocketService.js
└── App.jsx
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd government-chat-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔐 Authentication Flow

1. **ID Verification**: Enter your special security ID, mobile number, department, and designation
2. **OTP Verification**: Enter the 6-digit code sent to your registered mobile number
3. **Photo Verification**: Upload a clear photo of your government-issued ID document
4. **Access Granted**: Successfully authenticated users gain access to the chat interface

## 💬 Using the Chat Application

### Main Interface
- **Sidebar**: View online users and group chats
- **Chat Area**: Send and receive messages in real-time
- **Profile**: Manage your account settings and view security information

### Mock Data
The application uses mock data for demonstration purposes:
- Sample users from different departments
- Simulated message history
- Mock WebSocket connections

## 🎨 Styling

Each component has its own CSS file for modularity and maintainability:
- Individual component styling
- Responsive design for mobile and desktop
- Professional government-appropriate theme
- Consistent color scheme and typography

## 🔧 Development Features

- **Hot Module Replacement** with Vite
- **React Developer Tools** support
- **Component isolation** with individual CSS files
- **Mock backend** simulation for development

## 📱 Responsive Design

The application is fully responsive and works across:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🛡️ Security Considerations

While this is a frontend prototype, it simulates important security features:
- Multi-factor authentication
- Session management
- Encrypted communications (visual indicators)
- Government compliance standards

## 🚧 Future Enhancements

- Backend integration with real authentication APIs
- Actual WebSocket server implementation
- File sharing capabilities
- Video/voice calling integration
- Advanced group management
- Message encryption
- Audit logging

## 📄 License

This project is designed for government use and should comply with relevant security and licensing requirements.

## 🤝 Contributing

This is a prototype application. For production use, please ensure proper security auditing and compliance with government standards.

---

**Note**: This application is a frontend prototype with simulated backend functionality. For production deployment, integrate with actual government authentication systems and secure backend services.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
