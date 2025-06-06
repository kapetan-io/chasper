import { useState, useCallback } from 'react';
import { Channel } from '../types';
import { channelApi } from '../services';
import { channelStore } from '../storage';
import { useChat } from '../context/ChatContext';

export const useChannels = () => {
  const { loadChannels } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const fetchChannels = useCallback(async (): Promise<Channel[]> => {
    setIsLoading(true);
    
    try {
      const channels = await channelApi.getChannels();
      if (channels) {
        await channelStore.setChannels(channels);
        await loadChannels();
        return channels;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch channels:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [loadChannels]);

  const createChannel = useCallback(async (name: string, description?: string): Promise<Channel | null> => {
    setIsLoading(true);
    
    try {
      const channel = await channelApi.createChannel(name, description);
      if (channel) {
        await channelStore.addChannel(channel);
        await loadChannels();
        return channel;
      }
      return null;
    } catch (error) {
      console.error('Failed to create channel:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadChannels]);

  const joinChannel = useCallback(async (channelId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const success = await channelApi.joinChannel(channelId);
      if (success) {
        await fetchChannels();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to join channel:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchChannels]);

  const leaveChannel = useCallback(async (channelId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const success = await channelApi.leaveChannel(channelId);
      if (success) {
        await fetchChannels();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to leave channel:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchChannels]);

  const getChannel = useCallback(async (channelId: string): Promise<Channel | null> => {
    try {
      let channel = await channelStore.getChannel(channelId);
      
      if (!channel) {
        channel = await channelApi.getChannel(channelId);
        if (channel) {
          await channelStore.addChannel(channel);
        }
      }
      
      return channel;
    } catch (error) {
      console.error('Failed to get channel:', error);
      return null;
    }
  }, []);

  return {
    fetchChannels,
    createChannel,
    joinChannel,
    leaveChannel,
    getChannel,
    isLoading,
  };
};