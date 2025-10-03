import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatHistoryContext = createContext();

export const useChatHistory = () => {
  const context = useContext(ChatHistoryContext);
  if (!context) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};

export const ChatHistoryProvider = ({ children }) => {
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('chat-sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem('current-session-id');
    return saved || null;
  });

  // Save to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('chat-sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('current-session-id', currentSessionId);
    }
  }, [currentSessionId]);

  const createNewSession = (title = 'New Chat') => {
    const newSession = {
      id: uuidv4(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const updateSessionTitle = (sessionId, title) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, title, updatedAt: new Date().toISOString() }
          : session
      )
    );
  };

  const addMessageToSession = (sessionId, message) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === sessionId
          ? { 
              ...session, 
              messages: [...session.messages, message],
              updatedAt: new Date().toISOString(),
              // Auto-generate title from first user message
              title: session.messages.length === 0 && message.type === 'user' 
                ? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
                : session.title
            }
          : session
      )
    );
  };

  const deleteSession = (sessionId) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      // Switch to the next available session or create new one
      const remaining = chatSessions.filter(session => session.id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      } else {
        setCurrentSessionId(null);
      }
    }
  };

  const getCurrentSession = () => {
    return chatSessions.find(session => session.id === currentSessionId);
  };

  const switchToSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const clearCurrentSession = () => {
    if (currentSessionId) {
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: [], updatedAt: new Date().toISOString() }
            : session
        )
      );
    }
  };

  const clearAllSessions = () => {
    setChatSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem('chat-sessions');
    localStorage.removeItem('current-session-id');
  };

  return (
    <ChatHistoryContext.Provider value={{
      chatSessions,
      currentSessionId,
      createNewSession,
      updateSessionTitle,
      addMessageToSession,
      deleteSession,
      getCurrentSession,
      switchToSession,
      clearCurrentSession,
      clearAllSessions
    }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};