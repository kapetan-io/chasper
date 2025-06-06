import { useState, useCallback } from 'react';
import { messageApi } from '../services';
import { messageStore } from '../storage';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { MESSAGE_STATUS } from '../config';

export const useMessages = () => {
  const { user } = useAuth();
  const { currentChannelId, addMessage, updateMessage } = useChat();
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(async (content: string): Promise<boolean> => {
    if (!user || !currentChannelId || !content.trim()) {
      return false;
    }

    setIsSending(true);

    try {
      const optimisticMessage = messageStore.createOptimisticMessage(
        content.trim(),
        currentChannelId,
        user.id
      );

      await messageStore.addMessage(optimisticMessage);
      addMessage(optimisticMessage);

      const response = await messageApi.sendMessage({
        content: content.trim(),
        channelId: currentChannelId,
      });

      if (response) {
        const confirmedMessage = {
          ...response.message,
          timestamp: new Date(response.message.timestamp),
          status: MESSAGE_STATUS.SENT,
        };

        await messageStore.updateMessageStatus(
          response.message.id,
          optimisticMessage.localId,
          MESSAGE_STATUS.SENT
        );

        addMessage(confirmedMessage);
        return true;
      } else {
        await messageStore.updateMessageStatus(
          optimisticMessage.id,
          optimisticMessage.localId,
          MESSAGE_STATUS.FAILED
        );

        updateMessage(optimisticMessage.id, { status: MESSAGE_STATUS.FAILED });
        return false;
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [user, currentChannelId, addMessage, updateMessage]);

  const retryFailedMessage = useCallback(async (messageId: string): Promise<boolean> => {
    if (!user || !currentChannelId) {
      return false;
    }

    const messages = await messageStore.getMessages(currentChannelId);
    const failedMessage = messages.find(m => m.id === messageId && m.status === MESSAGE_STATUS.FAILED);
    
    if (!failedMessage) {
      return false;
    }

    return sendMessage(failedMessage.content);
  }, [user, currentChannelId, sendMessage]);

  const deleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      const success = await messageApi.deleteMessage(messageId);
      if (success) {
        await messageStore.deleteMessage(messageId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete message:', error);
      return false;
    }
  }, []);

  const editMessage = useCallback(async (messageId: string, newContent: string): Promise<boolean> => {
    try {
      const updatedMessage = await messageApi.updateMessage(messageId, newContent);
      if (updatedMessage) {
        await messageStore.addMessage({
          ...updatedMessage,
          timestamp: new Date(updatedMessage.timestamp),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to edit message:', error);
      return false;
    }
  }, []);

  return {
    sendMessage,
    retryFailedMessage,
    deleteMessage,
    editMessage,
    isSending,
  };
};