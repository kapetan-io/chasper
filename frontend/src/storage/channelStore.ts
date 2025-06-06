import AsyncStorage from '@react-native-async-storage/async-storage';
import { Channel } from '../types';
import { STORAGE_KEYS } from '../config';

class ChannelStore {
  private cache: Channel[] | null = null;

  async getChannels(): Promise<Channel[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHANNELS);
      const channels = stored ? JSON.parse(stored) : [];
      
      this.cache = channels;
      return channels;
    } catch (error) {
      console.error('Failed to get channels:', error);
      return [];
    }
  }

  async setChannels(channels: Channel[]): Promise<void> {
    this.cache = channels;
    await this.persistChannels(channels);
  }

  async addChannel(channel: Channel): Promise<void> {
    const channels = await this.getChannels();
    const existingIndex = channels.findIndex(c => c.id === channel.id);

    if (existingIndex >= 0) {
      channels[existingIndex] = channel;
    } else {
      channels.push(channel);
    }

    channels.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    this.cache = channels;
    await this.persistChannels(channels);
  }

  async updateChannel(channelId: string, updates: Partial<Channel>): Promise<void> {
    const channels = await this.getChannels();
    const channelIndex = channels.findIndex(c => c.id === channelId);

    if (channelIndex >= 0) {
      channels[channelIndex] = { ...channels[channelIndex], ...updates };
      this.cache = channels;
      await this.persistChannels(channels);
    }
  }

  async getChannel(channelId: string): Promise<Channel | null> {
    const channels = await this.getChannels();
    return channels.find(c => c.id === channelId) || null;
  }

  private async persistChannels(channels: Channel[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
    } catch (error) {
      console.error('Failed to persist channels:', error);
    }
  }

  async clearCache(): Promise<void> {
    this.cache = null;
  }
}

export const channelStore = new ChannelStore();