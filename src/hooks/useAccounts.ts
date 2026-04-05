import { useState, useEffect, useCallback } from 'react';
import type { Account } from '../types/api';
import { listAccounts, toggleAccountActive } from '../api/accounts';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAccounts(await listAccounts());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const toggle = useCallback(async (accountId: string) => {
    const updated = await toggleAccountActive(accountId);
    setAccounts(prev => prev.map(a => (a.id === updated.id ? updated : a)));
  }, []);

  return { accounts, loading, error, refetch: fetch, toggle };
}
