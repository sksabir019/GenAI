import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled, isTyping }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="input-container">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? 
              (isTyping ? "AI is typing..." : "Connecting...") : 
              "Type your message... (Press Enter to send, Shift+Enter for new line)"
            }
            disabled={disabled}
            className="message-input placeholder:text-gray-500 dark:placeholder:text-gray-400"
            rows={1}
            style={{ maxHeight: '120px' }}
          />
          
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="send-button"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            AI can search the web for current information when needed
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;