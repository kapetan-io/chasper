import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message, MessageStatus } from '../types';
import { STORAGE_KEYS, MESSAGE_STATUS } from '../config';

interface StoredMessage extends Message {
  localId?: string;
}

class MessageStore {
  private cache = new Map<string, StoredMessage[]>();

  async getMessages(channelId: string): Promise<StoredMessage[]> {
    if (this.cache.has(channelId)) {
      return this.cache.get(channelId)!;
    }

    try {
      const stored = await AsyncStorage.getItem(`${STORAGE_KEYS.MESSAGES}_${channelId}`);
      const messages = stored ? JSON.parse(stored) : [];
      
      this.cache.set(channelId, messages);
      return messages;
    } catch (error) {
      console.error('Failed to get messages:', error);
      return [];
    }
  }

  async addMessage(message: StoredMessage): Promise<void> {
    const channelId = message.channelId;
    const messages = await this.getMessages(channelId);
    
    const existingIndex = messages.findIndex(m => 
      m.id === message.id || (message.localId && m.localId === message.localId)
    );

    if (existingIndex >= 0) {
      messages[existingIndex] = message;
    } else {
      messages.push(message);
    }

    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    this.cache.set(channelId, messages);
    await this.persistMessages(channelId, messages);
  }

  async updateMessageStatus(messageId: string, localId: string | undefined, status: MessageStatus): Promise<void> {
    for (const [channelId, messages] of this.cache.entries()) {
      const messageIndex = messages.findIndex(m => 
        m.id === messageId || (localId && m.localId === localId)
      );

      if (messageIndex >= 0) {
        messages[messageIndex].status = status;
        if (messageId && messageId !== messages[messageIndex].id) {
          messages[messageIndex].id = messageId;
        }
        
        this.cache.set(channelId, messages);
        await this.persistMessages(channelId, messages);
        break;
      }
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    for (const [channelId, messages] of this.cache.entries()) {
      const filtered = messages.filter(m => m.id !== messageId);
      
      if (filtered.length !== messages.length) {
        this.cache.set(channelId, filtered);
        await this.persistMessages(channelId, filtered);
        break;
      }
    }
  }

  createOptimisticMessage(content: string, channelId: string, authorId: string): StoredMessage {
    const localId = `local_${Date.now()}_${Math.random()}`;
    
    return {
      id: localId,
      localId,
      content,
      channelId,
      authorId,
      timestamp: new Date(),
      status: MESSAGE_STATUS.PENDING,
    };
  }

  async getPendingMessages(): Promise<StoredMessage[]> {
    const pending: StoredMessage[] = [];
    
    for (const messages of this.cache.values()) {
      pending.push(...messages.filter(m => m.status === MESSAGE_STATUS.PENDING));
    }
    
    return pending;
  }

  private async persistMessages(channelId: string, messages: StoredMessage[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.MESSAGES}_${channelId}`,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error('Failed to persist messages:', error);
    }
  }

  async clearCache(): Promise<void> {
    this.cache.clear();
  }
}

export const messageStore = new MessageStore();