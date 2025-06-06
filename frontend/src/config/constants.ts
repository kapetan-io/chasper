export const MESSAGE_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  DELIVERED: 'delivered',
  READ: 'read',
} as const;

export const EVENT_TYPES = {
  MESSAGE_SENT: 'message:sent',
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_DELETED: 'message:deleted',
  MESSAGE_UPDATED: 'message:updated',
  CHANNEL_CREATED: 'channel:created',
  CHANNEL_UPDATED: 'channel:updated',
  USER_TYPING: 'user:typing',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
} as const;

export const STORAGE_KEYS = {
  MESSAGES: '@chasper/messages',
  CHANNELS: '@chasper/channels',
  USER_TOKEN: '@chasper/token',
  USER_PROFILE: '@chasper/profile',
  OFFLINE_QUEUE: '@chasper/offline_queue',
} as const;