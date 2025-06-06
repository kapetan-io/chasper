import { apiClient } from './client';
import { GetChannelsResponse, Channel } from '../../types';

export const channelApi = {
  async getChannels(): Promise<Channel[] | null> {
    const response = await apiClient.get<GetChannelsResponse>('/channels');
    return response.success ? response.data!.channels : null;
  },

  async getChannel(channelId: string): Promise<Channel | null> {
    const response = await apiClient.get<Channel>(`/channels/${channelId}`);
    return response.success ? response.data! : null;
  },

  async createChannel(name: string, description?: string): Promise<Channel | null> {
    const response = await apiClient.post<Channel>('/channels', { name, description });
    return response.success ? response.data! : null;
  },

  async joinChannel(channelId: string): Promise<boolean> {
    const response = await apiClient.post(`/channels/${channelId}/join`);
    return response.success;
  },

  async leaveChannel(channelId: string): Promise<boolean> {
    const response = await apiClient.post(`/channels/${channelId}/leave`);
    return response.success;
  },
};