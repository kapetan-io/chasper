import { Message, Channel, User } from './message';
import { EVENT_TYPES } from '../config';

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export interface BaseEvent {
  type: EventType;
  timestamp: Date;
}

export interface MessageEvent extends BaseEvent {
  type: typeof EVENT_TYPES.MESSAGE_SENT | typeof EVENT_TYPES.MESSAGE_RECEIVED | typeof EVENT_TYPES.MESSAGE_UPDATED;
  data: {
    message: Message;
  };
}

export interface MessageDeletedEvent extends BaseEvent {
  type: typeof EVENT_TYPES.MESSAGE_DELETED;
  data: {
    messageId: string;
    channelId: string;
  };
}

export interface ChannelEvent extends BaseEvent {
  type: typeof EVENT_TYPES.CHANNEL_CREATED | typeof EVENT_TYPES.CHANNEL_UPDATED;
  data: {
    channel: Channel;
  };
}

export interface UserTypingEvent extends BaseEvent {
  type: typeof EVENT_TYPES.USER_TYPING;
  data: {
    userId: string;
    channelId: string;
    isTyping: boolean;
  };
}

export interface UserStatusEvent extends BaseEvent {
  type: typeof EVENT_TYPES.USER_ONLINE | typeof EVENT_TYPES.USER_OFFLINE;
  data: {
    user: User;
  };
}

export type WebSocketEvent = 
  | MessageEvent 
  | MessageDeletedEvent 
  | ChannelEvent 
  | UserTypingEvent 
  | UserStatusEvent;