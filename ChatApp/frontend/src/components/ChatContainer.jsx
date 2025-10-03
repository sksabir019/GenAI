import React, { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ConnectionStatus from './ConnectionStatus';
import { useChat } from '../hooks/useChat';
import { useChatHistory } from '../contexts/ChatHistoryContext';

const ChatContainer = () => {
  const { currentSessionId, createNewSession } = useChatHistory();
  const {
    messages,
    isTyping,
    isConnected,
    error,
    sendMessage,
    clearChat,
    retry
  } = useChat(currentSessionId);

  // Create a new session if none exists
  useEffect(() => {
    if (!currentSessionId) {
      createNewSession();
    }
  }, [currentSessionId, createNewSession]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <ChatHeader onClearChat={clearChat} />
        <ConnectionStatus 
          isConnected={isConnected} 
          error={error} 
          onRetry={retry} 
        />
      </div>
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages 
          messages={messages} 
          isTyping={isTyping} 
          error={error}
        />
      </div>
      
      {/* Fixed Input */}
      <div className="flex-shrink-0">
        <ChatInput 
          onSendMessage={sendMessage}
          disabled={!isConnected || isTyping}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
};

export default ChatContainer;