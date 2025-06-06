import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ChatProvider } from './ChatContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </AuthProvider>
  );
};