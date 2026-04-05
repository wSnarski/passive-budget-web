import { get, post } from './client';
import type { TransactionListResponse, Transaction } from '../types/api';

export function listTransactions(params?: {
  limit?: number;
  offset?: number;
  accountId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}) {
  const query: Record<string, string> = {};
  if (params?.limit != null) query.limit = String(params.limit);
  if (params?.offset != null) query.offset = String(params.offset);
  if (params?.accountId) query.accountId = params.accountId;
  if (params?.category) query.category = params.category;
  if (params?.startDate) query.startDate = params.startDate;
  if (params?.endDate) query.endDate = params.endDate;
  return get<TransactionListResponse>('/transaction/list', query);
}

export function recategorizeTransaction(transactionId: string, category: string) {
  return post<Transaction>('/transaction/recategorize', { transactionId, category });
}
