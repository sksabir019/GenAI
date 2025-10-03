import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import { v4 as uuidv4 } from 'uuid';

export const useChat = (sessionId) => {
  const { socket, isConnected } = useSocket();
  const { getCurrentSession, addMessageToSession, clearCurrentSession, currentSessionId } = useChatHistory();
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Get messages from current session
  const currentSession = getCurrentSession();
  const messages = currentSession?.messages || [];

  useEffect(() => {
    if (!socket) return;

    // Listen for assistant messages
    socket.on('assistant_message', (data) => {
      console.log('Received assistant message:', data);
      console.log('Current sessionId:', currentSessionId);
      
      const newMessage = {
        id: uuidv4(),
        type: 'assistant',
        content: data.message,
        timestamp: data.timestamp || new Date().toISOString()
      };
      
      // Use currentSessionId from context instead of the parameter
      if (currentSessionId) {
        addMessageToSession(currentSessionId, newMessage);
        console.log('Message added to session:', currentSessionId);
      } else {
        console.warn('No currentSessionId available to add message');
      }
      setIsTyping(false);
      setError(null);
    });

    // Listen for typing indicator
    socket.on('assistant_typing', (data) => {
      setIsTyping(data.typing);
    });

    // Listen for errors
    socket.on('error', (data) => {
      setError(data.message);
      setIsTyping(false);
    });

    // Cleanup listeners
    return () => {
      socket.off('assistant_message');
      socket.off('assistant_typing');
      socket.off('error');
    };
  }, [socket, currentSessionId, addMessageToSession]);

  const sendMessage = useCallback((message) => {
    if (!socket) {
      console.warn('Socket not available');
      setError('Connection not available');
      return;
    }
    
    if (!isConnected) {
      console.warn('Socket not connected');
      setError('Not connected to server');
      return;
    }
    
    if (!message.trim()) {
      console.warn('Empty message');
      return;
    }
    
    if (!currentSessionId) {
      console.warn('No session ID available');
      setError('No active chat session');
      return;
    }

    // Add user message to chat
    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    addMessageToSession(currentSessionId, userMessage);
    setError(null);

    // Send message to server
    console.log('Sending message to server with sessionId:', currentSessionId);
    socket.emit('chat_message', {
      message: message,
      sessionId: currentSessionId
    });

    // Start typing indicator
    setIsTyping(true);
  }, [socket, isConnected, currentSessionId, addMessageToSession]);

  const clearChat = useCallback(() => {
    clearCurrentSession();
    setError(null);
    setIsTyping(false);
  }, [clearCurrentSession]);

  const retry = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMessage = messages
        .filter(msg => msg.type === 'user')
        .pop();
      
      if (lastUserMessage) {
        sendMessage(lastUserMessage.content);
      }
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isTyping,
    isConnected,
    error,
    sendMessage,
    clearChat,
    retry,
    sessionId: currentSessionId
  };
};