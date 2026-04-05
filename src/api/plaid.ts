import { get, post } from './client';
import type { PlaidItem, ExchangeTokenResponse } from '../types/api';

export function createLinkToken() {
  return post<{ linkToken: string }>('/plaid/create-link-token');
}

export function exchangeToken(publicToken: string, institutionId?: string, institutionName?: string) {
  return post<ExchangeTokenResponse>('/plaid/exchange-token', { publicToken, institutionId, institutionName });
}

export function syncTransactions(plaidItemId: string) {
  return post('/plaid/sync-transactions', { plaidItemId });
}

export function listPlaidItems() {
  return get<PlaidItem[]>('/plaid/items');
}

export function removePlaidItem(plaidItemId: string) {
  return post<PlaidItem>('/plaid/remove-item', { plaidItemId });
}
