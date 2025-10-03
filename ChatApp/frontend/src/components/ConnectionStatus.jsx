import React from 'react';
import { Wifi, WifiOff, AlertCircle, RotateCcw } from 'lucide-react';

const ConnectionStatus = ({ isConnected, error, onRetry }) => {
  if (isConnected && !error) {
    return null;
  }

  return (
    <div className={`px-4 py-2 text-center text-sm transition-colors duration-200 ${
      error ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-b border-red-200 dark:border-red-800' : 
      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-b border-yellow-200 dark:border-yellow-800'
    }`}>
      <div className="max-w-4xl mx-auto flex items-center justify-center space-x-2">
        {error ? (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button
              onClick={onRetry}
              className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Connecting to server...</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;