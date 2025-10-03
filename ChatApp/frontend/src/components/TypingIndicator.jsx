import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary-600" />
      </div>
      
      <div className="message-bubble assistant-message">
        <div className="typing-indicator">
          <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
          <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
          <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;