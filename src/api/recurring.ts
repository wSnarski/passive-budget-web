import { get, post } from './client';
import type { RecurringPattern } from '../types/api';

export function listRecurring(includeInactive?: boolean) {
  const params: Record<string, string> = {};
  if (includeInactive) params.includeInactive = 'true';
  return get<RecurringPattern[]>('/recurring/list', params);
}

export function confirmRecurring(recurringTransactionId: string) {
  return post<RecurringPattern>('/recurring/confirm', { recurringTransactionId });
}

export function dismissRecurring(recurringTransactionId: string) {
  return post<RecurringPattern>('/recurring/dismiss', { recurringTransactionId });
}

export function detectRecurring() {
  return post('/recurring/detect');
}
