import { Message, Channel, User } from './message';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  refreshToken: string;
}

export interface SendMessageRequest {
  content: string;
  channelId: string;
  replyTo?: string;
}

export interface SendMessageResponse {
  message: Message;
}

export interface GetMessagesRequest {
  channelId: string;
  page?: number;
  limit?: number;
  before?: string;
}

export interface GetChannelsResponse {
  channels: Channel[];
}