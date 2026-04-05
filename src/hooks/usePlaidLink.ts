import { useState, useCallback, useEffect } from 'react';
import { usePlaidLink as usePlaidLinkLib } from 'react-plaid-link';
import { createLinkToken, exchangeToken, syncTransactions } from '../api/plaid';

export function usePlaidLinkFlow(onSuccess: () => void) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { linkToken: lt } = await createLinkToken();
      setLinkToken(lt);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create link token');
    } finally {
      setLoading(false);
    }
  }, []);

  const plaid = usePlaidLinkLib({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        setLoading(true);
        const res = await exchangeToken(
          publicToken,
          metadata.institution?.institution_id,
          metadata.institution?.name,
        );
        await syncTransactions(res.plaidItem.plaidItemId);
        onSuccess();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to exchange token');
      } finally {
        setLoading(false);
      }
    },
  });

  // Auto-open once link token is ready
  useEffect(() => {
    if (linkToken && plaid.ready) {
      plaid.open();
    }
  }, [linkToken, plaid.ready, plaid.open]);

  return {
    open: plaid.ready ? plaid.open : initiate,
    ready: plaid.ready,
    loading,
    error,
    linkToken,
  };
}
