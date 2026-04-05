import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Pagination } from '../types/api';
import { listTransactions, recategorizeTransaction } from '../api/transactions';

interface Filters {
  accountId?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export function useTransactions(page = 1, limit = 20, filters?: Filters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listTransactions({
        limit,
        offset: (page - 1) * limit,
        ...filters,
      });
      setTransactions(res.transactions);
      setPagination(res.pagination);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters?.accountId, filters?.category, filters?.startDate, filters?.endDate]);

  useEffect(() => { fetch(); }, [fetch]);

  const recategorize = useCallback(async (transactionId: string, category: string) => {
    const updated = await recategorizeTransaction(transactionId, category);
    setTransactions(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  }, []);

  return { transactions, pagination, loading, error, refetch: fetch, recategorize };
}
