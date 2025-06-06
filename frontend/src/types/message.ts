import { MESSAGE_STATUS } from '../config';

export type MessageStatus = typeof MESSAGE_STATUS[keyof typeof MESSAGE_STATUS];

export interface User {
  id: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  timestamp: Date;
  status: MessageStatus;
  localId?: string;
  replyTo?: string;
  editedAt?: Date;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberIds: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}