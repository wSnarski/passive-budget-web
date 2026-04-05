import { useState, useEffect, useCallback } from 'react';
import type { Projection } from '../types/api';
import { getMonthlyProjection } from '../api/projections';

export function useProjection(month?: string) {
  const [projection, setProjection] = useState<Projection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProjection(await getMonthlyProjection(month));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => { fetch(); }, [fetch]);

  return { projection, loading, error, refetch: fetch };
}
