import { get, post } from './client';
import type { AuthResponse, User } from '../types/api';

export function login(email: string, password: string) {
  return post<AuthResponse>('/auth/login', { email, password });
}

export function register(data: { email: string; password: string; firstName?: string; lastName?: string }) {
  return post<AuthResponse>('/auth/register', data);
}

export function getMe() {
  return get<User>('/auth/me');
}
