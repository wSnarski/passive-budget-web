import { useState, useEffect, useCallback } from 'react';
import type { RecurringPattern } from '../types/api';
import { listRecurring, confirmRecurring, dismissRecurring } from '../api/recurring';

export function useRecurring(includeInactive = false) {
  const [patterns, setPatterns] = useState<RecurringPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPatterns(await listRecurring(includeInactive));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => { fetch(); }, [fetch]);

  const confirm = useCallback(async (id: string) => {
    const updated = await confirmRecurring(id);
    setPatterns(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  }, []);

  const dismiss = useCallback(async (id: string) => {
    const updated = await dismissRecurring(id);
    setPatterns(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  }, []);

  return { patterns, loading, error, refetch: fetch, confirm, dismiss };
}
