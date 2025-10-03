import React from 'react';
import ChatApp from './components/ChatApp';
import { SocketProvider } from './hooks/useSocket';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatHistoryProvider } from './contexts/ChatHistoryContext';

function App() {
  return (
    <ThemeProvider>
      <ChatHistoryProvider>
        <SocketProvider>
          <div className="App h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <ChatApp />
          </div>
        </SocketProvider>
      </ChatHistoryProvider>
    </ThemeProvider>
  );
}

export default App;