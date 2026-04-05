import { useState, useCallback } from 'react';
import type { WhatIfResponse } from '../types/api';
import { whatIf } from '../api/projections';

export function useWhatIf() {
  const [result, setResult] = useState<WhatIfResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (amount: number, category?: string) => {
    setLoading(true);
    setError(null);
    try {
      setResult(await whatIf(amount, category));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => setResult(null), []);

  return { result, loading, error, calculate, reset };
}
