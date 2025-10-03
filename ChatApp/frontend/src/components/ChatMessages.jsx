import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatMessages = ({ messages, isTyping, error }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  useEffect(() => {
    // Add a small delay to ensure content is rendered before scrolling
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    return (
      <div className="h-full overflow-y-auto chat-messages bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Welcome to AI Chat Assistant
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start a conversation by typing a message below. I can help you with various tasks and search the web for current information when needed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={messagesContainerRef}
      className="h-full overflow-y-auto chat-messages bg-gray-50 dark:bg-gray-800 transition-colors duration-200"
    >
      <div className="py-6 space-y-4 min-h-full">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
        
        {isTyping && (
          <div className="message-container">
            <TypingIndicator />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;