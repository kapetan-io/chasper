import { useQuery } from '@tanstack/react-query';
import { channelsApi } from '../services/api/channels';
import { Channel } from '../types';

export const useChannelsQuery = () => {
  return useQuery({
    queryKey: ['channels'],
    queryFn: channelsApi.getChannels,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useChannelQuery = (channelId: string) => {
  return useQuery({
    queryKey: ['channels', channelId],
    queryFn: () => channelsApi.getChannel(channelId),
    enabled: !!channelId,
  });
};