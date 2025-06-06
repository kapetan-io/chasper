import { apiClient } from '../api/client';
import { LoginRequest, LoginResponse, User } from '../../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse | null> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    
    return null;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.setToken(null);
  },

  async getCurrentUser(): Promise<User | null> {
    const response = await apiClient.get<User>('/auth/me');
    return response.success ? response.data! : null;
  },

  async refreshToken(refreshToken: string): Promise<string | null> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh', { refreshToken });
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
      return response.data.token;
    }
    
    return null;
  },
};