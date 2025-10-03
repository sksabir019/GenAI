import React from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { useChatHistory } from '../contexts/ChatHistoryContext';

const ChatHeader = ({ onClearChat }) => {
  const { getCurrentSession } = useChatHistory();
  const currentSession = getCurrentSession();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <MessageCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentSession?.title || 'AI Chat Assistant'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask me anything - I can search the web for current information
            </p>
          </div>
        </div>
        
        <button
          onClick={onClearChat}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 
                     hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                     rounded-lg transition-colors duration-200"
          title="Clear current chat"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;