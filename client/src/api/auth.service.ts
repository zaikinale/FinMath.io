import { $api } from './axios.js';

// Типизируем данные, которые приходят с сервера (по твоему бекенду)
interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
}

export const AuthService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const { data } = await $api.post<AuthResponse>('/auth/register', {
      email,
      password,
    });
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await $api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  async logout(): Promise<void> {
    await $api.post('/auth/logout');
  },

  async getSessions() {
    const { data } = await $api.get('/auth/sessions');
    return data;
  }
};