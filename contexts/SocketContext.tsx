'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { 
  sendMessage as sendFirebaseMessage, 
  markMessagesAsRead,
  subscribeToUserChats,
  Chat,
  ChatMessage
} from '../lib/chatService';

interface ChatContextType {
  sendMessage: (chatId: string, content: string, senderName: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  setCurrentChat: (chatId: string | null) => void;
  setOnChatPage: (isOnChatPage: boolean) => void;
  chats: Chat[];
  loading: boolean;
  currentChatId: string | null;
  isOnChatPage: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnChatPage, setIsOnChatPage] = useState(false);
  const unsubscribeChats = useRef<(() => void) | null>(null);

  // Simple chat listener - just for getting chat list
  useEffect(() => {
    if (!user) return;

    unsubscribeChats.current = subscribeToUserChats(user._id, (updatedChats) => {
      setChats(updatedChats);
      setLoading(false);
    });

    return () => {
      if (unsubscribeChats.current) {
        unsubscribeChats.current();
      }
    };
  }, [user]);

  const setCurrentChat = (chatId: string | null) => {
    setCurrentChatId(chatId);
  };

  const setOnChatPage = (onChatPage: boolean) => {
    setIsOnChatPage(onChatPage);
  };

  const sendMessage = async (chatId: string, content: string, senderName: string) => {
    if (!user) return;
    
    try {
      await sendFirebaseMessage(chatId, {
        senderId: user._id,
        senderName,
        content,
        read: false,
        messageType: 'text'
      }, currentChatId);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const markAsRead = async (chatId: string) => {
    if (!user) return;
    
    try {
      await markMessagesAsRead(chatId, user._id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const value: ChatContextType = {
    sendMessage,
    markAsRead,
    setCurrentChat,
    setOnChatPage,
    chats,
    loading,
    currentChatId,
    isOnChatPage
  };


  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
