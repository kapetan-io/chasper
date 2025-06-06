const isDev = __DEV__;
const isProd = !__DEV__;

export const config = {
  isDev,
  isProd,
  api: {
    baseUrl: isDev 
      ? 'http://localhost:3000/api' 
      : 'https://api.chasper.com',
    timeout: 10000,
  },
  websocket: {
    url: isDev 
      ? 'ws://localhost:3000/ws' 
      : 'wss://api.chasper.com/ws',
    reconnectInterval: 5000,
    maxReconnectAttempts: 5,
  },
  storage: {
    messagesCacheSize: 1000,
    channelsCacheSize: 100,
  },
  notifications: {
    enablePush: true,
    enableInApp: true,
  },
} as const;

export type Config = typeof config;