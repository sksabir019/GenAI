import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.type === 'user';

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="message-container">
      <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
        )}
        
        <div className={`group relative ${isUser ? 'order-1' : 'order-2'}`}>
          <div className={`message-bubble ${isUser ? 'user-message' : 'assistant-message'}`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          <div className={`flex items-center mt-1 space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(message.timestamp)}
            </span>
            
            {!isUser && (
              <button
                onClick={() => copyToClipboard(message.content)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                           text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded"
                title="Copy message"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-500 dark:text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center order-2">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;