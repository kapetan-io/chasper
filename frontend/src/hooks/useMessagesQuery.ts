import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../services/api/messages';
import { Message } from '../types';

export const useMessagesQuery = (channelId: string) => {
  return useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => messagesApi.getMessages(channelId),
    enabled: !!channelId,
    staleTime: 10 * 1000, // 10 seconds
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onMutate: async (newMessage) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['messages', newMessage.channelId] 
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<Message[]>([
        'messages', 
        newMessage.channelId
      ]);

      // Optimistically update
      const optimisticMessage: Message = {
        ...newMessage,
        id: `temp-${Date.now()}`,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(
        ['messages', newMessage.channelId],
        (old = []) => [...old, optimisticMessage]
      );

      return { previousMessages, optimisticMessage };
    },
    onError: (err, newMessage, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['messages', newMessage.channelId],
          context.previousMessages
        );
      }
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic message with real one
      queryClient.setQueryData<Message[]>(
        ['messages', variables.channelId],
        (old = []) => 
          old.map(msg => 
            msg.id === context?.optimisticMessage.id ? data : msg
          )
      );
    },
  });
};