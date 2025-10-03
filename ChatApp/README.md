# 🤖 AI Chat Assistant

A modern, full-stack AI chat application with web search capabilities, built with React, Node.js, and real-time WebSocket communication.

![Chat App Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-ISC-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)

## ✨ Features

### 🎯 Core Functionality
- **Real-time AI Chat** - Powered by Groq's Llama 3.3 70B model
- **Web Search Integration** - Automatic web search using Tavily API for current information
- **Smart Tool Calling** - AI automatically decides when to search the web
- **Session Management** - Persistent chat history with multiple sessions
- **Real-time Communication** - WebSocket-based messaging with Socket.IO

### 🎨 User Experience
- **ChatGPT-like Interface** - Modern, responsive design with sidebar navigation
- **Dark/Light Theme** - Comprehensive theme support with smooth transitions
- **Chat History** - Create, manage, and search through chat sessions
- **Auto-scroll** - Messages automatically scroll to show latest content
- **Typing Indicators** - Real-time typing status and connection indicators
- **Mobile Responsive** - Fully optimized for mobile and desktop devices

### 🛠️ Technical Features
- **Fixed Layout** - Header and input stay fixed while messages scroll
- **Markdown Support** - Rich text formatting and syntax highlighting
- **Error Handling** - Comprehensive error handling with retry mechanisms
- **Logging System** - Structured logging with Winston
- **Security** - CORS protection, rate limiting, and input validation

## 🏗️ Architecture

```
ChatApp/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # Tailwind CSS styles
│   └── package.json
├── backend/           # Node.js + Express backend
│   ├── services/          # Business logic services
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Express middlewares
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Groq API Key** - Get from [Groq Console](https://console.groq.com/)
- **Tavily API Key** - Get from [Tavily](https://tavily.com/)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ChatApp
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment configuration
cp config.env.example config.env
```

Edit `backend/config.env`:
```env
# Server Configuration
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000

# AI Configuration
GROQ_API_KEY=your_groq_api_key_here
TEMPERATURE=0.7
TOP_P=0.95
MAX_COMPLETION_TOKENS=2048

# Web Search Configuration
TAVILY_API_KEY=your_tavily_api_key_here
MAX_SEARCH_RESULTS=5

# Logging
LOG_LEVEL=info
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment configuration
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### 4. Start the Application

#### Option A: Development Mode (Recommended)
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

#### Option B: Production Mode
```bash
# Build frontend
cd frontend
npm run build

# Start backend (serves frontend)
cd ../backend
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/config.env`)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `3001` | No |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` | No |
| `GROQ_API_KEY` | Groq API key for AI | - | **Yes** |
| `TAVILY_API_KEY` | Tavily API key for web search | - | **Yes** |
| `TEMPERATURE` | AI response creativity (0-1) | `0.7` | No |
| `TOP_P` | AI response diversity (0-1) | `0.95` | No |
| `MAX_COMPLETION_TOKENS` | Max tokens per response | `2048` | No |
| `MAX_SEARCH_RESULTS` | Max web search results | `5` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

#### Frontend (`frontend/.env`)
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` | No |

## 📁 Project Structure

### Frontend Structure
```
frontend/src/
├── components/
│   ├── ChatApp.jsx           # Main app component
│   ├── ChatContainer.jsx     # Chat layout container
│   ├── ChatHeader.jsx        # Chat header with title
│   ├── ChatMessages.jsx      # Messages display area
│   ├── ChatInput.jsx         # Message input component
│   ├── MessageBubble.jsx     # Individual message bubble
│   ├── Sidebar.jsx           # Navigation sidebar
│   ├── ConnectionStatus.jsx  # Connection indicator
│   └── TypingIndicator.jsx   # Typing animation
├── contexts/
│   ├── ThemeContext.jsx      # Dark/light theme management
│   └── ChatHistoryContext.jsx # Chat session management
├── hooks/
│   ├── useSocket.jsx         # WebSocket connection hook
│   └── useChat.jsx           # Chat functionality hook
├── index.css                 # Tailwind CSS styles
└── App.jsx                   # Root component
```

### Backend Structure
```
backend/
├── services/
│   ├── chatService.js        # Core chat logic
│   ├── groqService.js        # Groq AI integration
│   └── webSearchService.js   # Tavily web search
├── config/
│   ├── config.js             # Configuration loader
│   └── config.env            # Environment variables
├── utils/
│   └── logger.js             # Winston logging setup
├── middlewares/
│   ├── cors.js               # CORS configuration
│   ├── rateLimiter.js        # Rate limiting
│   └── errorHandler.js       # Global error handling
└── server.js                 # Express server setup
```

## 🔌 API Endpoints

### WebSocket Events

#### Client → Server
```javascript
// Send a chat message
socket.emit('sendMessage', {
  message: 'Hello, AI!',
  sessionId: 'session-uuid'
});
```

#### Server → Client
```javascript
// Receive AI response
socket.on('messageResponse', {
  message: 'Hello! How can I help you?',
  sessionId: 'session-uuid',
  timestamp: '2025-10-03T07:41:00.000Z'
});

// Connection status updates
socket.on('connect', () => { /* Connected */ });
socket.on('disconnect', () => { /* Disconnected */ });
socket.on('error', (error) => { /* Handle error */ });
```

## 🎨 Customization

### Theme Customization
The app uses Tailwind CSS with custom color schemes defined in `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9', // Main brand color
        600: '#0284c7',
        700: '#0369a1',
        900: '#0c4a6e',
      }
    }
  }
}
```

### AI Model Configuration
Modify AI behavior in `backend/config.env`:
- `TEMPERATURE`: Controls creativity (0 = focused, 1 = creative)
- `TOP_P`: Controls response diversity
- `MAX_COMPLETION_TOKENS`: Maximum response length

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests (if available)
cd frontend
npm test
```

### Code Linting
```bash
# Frontend linting
cd frontend
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Building for Production
```bash
cd frontend
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Deploy to Heroku
1. **Prepare for deployment**:
```bash
# Create Procfile in root directory
echo "web: cd backend && npm start" > Procfile
```

2. **Set environment variables** in Heroku dashboard or CLI:
```bash
heroku config:set GROQ_API_KEY=your_key_here
heroku config:set TAVILY_API_KEY=your_key_here
heroku config:set NODE_ENV=production
```

3. **Deploy**:
```bash
git add .
git commit -m "Ready for production"
git push heroku main
```

### Deploy to Vercel (Frontend) + Railway (Backend)
1. **Frontend (Vercel)**:
   - Connect GitHub repository
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/dist`

2. **Backend (Railway)**:
   - Connect GitHub repository
   - Set start command: `cd backend && npm start`
   - Add environment variables in Railway dashboard

## 🛠️ Troubleshooting

### Common Issues

#### 1. Connection Issues
```bash
# Check if ports are available
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill processes if needed
killall node
```

#### 2. API Key Issues
- Verify API keys are correct in `config.env`
- Check API key permissions and quotas
- Ensure no extra spaces in environment variables

#### 3. Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache (frontend)
rm -rf .vite dist
```

#### 4. WebSocket Connection Issues
- Check CORS configuration in `backend/server.js`
- Verify `CLIENT_URL` in backend config matches frontend URL
- Check browser developer console for WebSocket errors

### Debug Mode
Enable detailed logging:
```env
# In backend/config.env
LOG_LEVEL=debug
NODE_ENV=development
```

## 📝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style
- Use ESLint configuration provided
- Follow React best practices
- Use meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** - For providing fast AI inference
- **Tavily** - For web search capabilities
- **React Team** - For the amazing frontend framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Socket.IO** - For real-time communication

## 📞 Support

For support, email [your-email] or create an issue in the repository.

---

**Built with ❤️ using React, Node.js, and modern web technologies**