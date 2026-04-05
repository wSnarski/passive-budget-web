import { get, post } from './client';
import type { Account } from '../types/api';

export function listAccounts() {
  return get<Account[]>('/account/list');
}

export function toggleAccountActive(accountId: string) {
  return post<Account>('/account/toggle-active', { accountId });
}
