import { apiClient } from './client';
import { 
  SendMessageRequest, 
  SendMessageResponse, 
  GetMessagesRequest,
  PaginatedResponse,
  Message
} from '../../types';

export const messageApi = {
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse | null> {
    const response = await apiClient.post<SendMessageResponse>('/messages', request);
    return response.success ? response.data! : null;
  },

  async getMessages(request: GetMessagesRequest): Promise<PaginatedResponse<Message> | null> {
    const params = new URLSearchParams();
    params.append('channelId', request.channelId);
    
    if (request.page) params.append('page', request.page.toString());
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.before) params.append('before', request.before);

    const response = await apiClient.get<PaginatedResponse<Message>>(`/messages?${params}`);
    return response.success ? response.data! : null;
  },

  async deleteMessage(messageId: string): Promise<boolean> {
    const response = await apiClient.delete(`/messages/${messageId}`);
    return response.success;
  },

  async updateMessage(messageId: string, content: string): Promise<Message | null> {
    const response = await apiClient.put<Message>(`/messages/${messageId}`, { content });
    return response.success ? response.data! : null;
  },
};