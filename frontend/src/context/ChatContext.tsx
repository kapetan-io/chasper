import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, Channel } from '../types';
import { messageStore, channelStore } from '../storage';
import { useAuth } from './AuthContext';

interface ChatContextType {
  messages: Message[];
  channels: Channel[];
  currentChannelId: string | null;
  isLoading: boolean;
  setCurrentChannelId: (channelId: string | null) => void;
  loadMessages: (channelId: string) => Promise<void>;
  loadChannels: () => Promise<void>;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  refreshData: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadChannels();
    } else {
      setMessages([]);
      setChannels([]);
      setCurrentChannelId(null);
    }
  }, [user]);

  useEffect(() => {
    if (currentChannelId) {
      loadMessages(currentChannelId);
    } else {
      setMessages([]);
    }
  }, [currentChannelId]);

  const loadMessages = async (channelId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const storedMessages = await messageStore.getMessages(channelId);
      setMessages(storedMessages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })));
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChannels = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const storedChannels = await channelStore.getChannels();
      setChannels(storedChannels.map(channel => ({
        ...channel,
        createdAt: new Date(channel.createdAt),
        updatedAt: new Date(channel.updatedAt),
      })));
    } catch (error) {
      console.error('Failed to load channels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (message: Message): void => {
    setMessages(prev => {
      const existing = prev.find(m => m.id === message.id || (message.localId && m.localId === message.localId));
      if (existing) {
        return prev.map(m => 
          (m.id === message.id || (message.localId && m.localId === message.localId)) 
            ? message 
            : m
        );
      }
      
      const newMessages = [...prev, message];
      return newMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
  };

  const updateMessage = (messageId: string, updates: Partial<Message>): void => {
    setMessages(prev => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, ...updates }
          : message
      )
    );
  };

  const deleteMessage = (messageId: string): void => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  };

  const refreshData = async (): Promise<void> => {
    await loadChannels();
    if (currentChannelId) {
      await loadMessages(currentChannelId);
    }
  };

  const value: ChatContextType = {
    messages,
    channels,
    currentChannelId,
    isLoading,
    setCurrentChannelId,
    loadMessages,
    loadChannels,
    addMessage,
    updateMessage,
    deleteMessage,
    refreshData,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};