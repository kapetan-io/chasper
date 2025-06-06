import { useEffect, useState, useCallback } from 'react';
import { wsConnection } from '../connection';
import { eventRouter } from '../eventHandlers';

export const useWebSocket = (token?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    try {
      setIsConnecting(true);
      await wsConnection.connect(token);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [token, isConnecting, isConnected]);

  const disconnect = useCallback(() => {
    wsConnection.disconnect();
  }, []);

  const send = useCallback((data: any) => {
    wsConnection.send(data);
  }, []);

  useEffect(() => {
    const removeEventHandler = wsConnection.addEventHandler(eventRouter);
    const removeConnectionHandler = wsConnection.addConnectionStateHandler(setIsConnected);

    return () => {
      removeEventHandler();
      removeConnectionHandler();
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    send,
  };
};