import React, { useState } from 'react';
import { 
  Plus, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  Sun, 
  Moon, 
  Settings,
  X,
  Search
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useChatHistory } from '../contexts/ChatHistoryContext';

const Sidebar = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { 
    chatSessions, 
    currentSessionId, 
    createNewSession, 
    switchToSession, 
    deleteSession,
    updateSessionTitle 
  } = useChatHistory();
  
  const [editingSession, setEditingSession] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewChat = () => {
    createNewSession();
    onClose();
  };

  const handleSessionClick = (sessionId) => {
    switchToSession(sessionId);
    onClose();
  };

  const handleEditStart = (session, e) => {
    e.stopPropagation();
    setEditingSession(session.id);
    setEditTitle(session.title);
  };

  const handleEditSave = (sessionId) => {
    updateSessionTitle(sessionId, editTitle);
    setEditingSession(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingSession(null);
    setEditTitle('');
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      deleteSession(sessionId);
    }
  };

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset time to compare just dates
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowOnly - dateOnly;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Chat</h2>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="w-full flex items-center space-x-3 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No chats found' : 'No chat history'}
          </div>
        ) : (
          <div className="p-2">
            {filteredSessions.map(session => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className={`
                  group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1
                  ${currentSessionId === session.id 
                    ? 'bg-primary-50 dark:bg-gray-700 text-primary-700 dark:text-white' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    {editingSession === session.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleEditSave(session.id)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleEditSave(session.id);
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded text-sm focus:outline-none border border-gray-300 dark:border-gray-500"
                        autoFocus
                      />
                    ) : (
                      <>
                        <div className="text-sm font-medium truncate">
                          {session.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(session.updatedAt)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEditStart(session, e)}
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white rounded"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Settings */}
        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;