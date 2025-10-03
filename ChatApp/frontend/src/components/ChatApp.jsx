import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatContainer from './ChatContainer';
import { Menu, X } from 'lucide-react';

const ChatApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Mobile menu button */}
        <div className="lg:hidden bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Chat container */}
        <div className="flex-1 min-h-0">
          <ChatContainer />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;