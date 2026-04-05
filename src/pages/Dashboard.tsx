import { useCallback, useRef } from 'react';
import { useProjection } from '../hooks/useProjection';
import { useAccounts } from '../hooks/useAccounts';
import { useRecurring } from '../hooks/useRecurring';
import ProjectionCard from '../components/dashboard/ProjectionCard';
import AccountList from '../components/dashboard/AccountList';
import RecurringList from '../components/dashboard/RecurringList';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import PlaidLinkButton from '../components/dashboard/PlaidLinkButton';

export default function Dashboard() {
  const { projection, loading: projLoading, error: projError, refetch: refetchProj } = useProjection();
  const { accounts, loading: acctLoading, refetch: refetchAccts } = useAccounts();
  const { patterns, loading: recLoading, confirm, dismiss } = useRecurring();
  const plaidBtnRef = useRef<HTMLDivElement>(null);

  const handlePlaidSuccess = useCallback(() => {
    refetchProj();
    refetchAccts();
  }, [refetchProj, refetchAccts]);

  const handleLinkBank = useCallback(() => {
    // Trigger the PlaidLinkButton's click programmatically
    const btn = plaidBtnRef.current?.querySelector('button');
    btn?.click();
  }, []);

  return (
    <div className="space-y-6">
      <ProjectionCard projection={projection} loading={projLoading} error={projError} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <AccountList accounts={accounts} loading={acctLoading} onLinkBank={handleLinkBank} />
          <div ref={plaidBtnRef}>
            <PlaidLinkButton onSuccess={handlePlaidSuccess} />
          </div>
        </div>
        <RecurringList patterns={patterns} loading={recLoading} onConfirm={confirm} onDismiss={dismiss} />
      </div>

      <RecentTransactions />
    </div>
  );
}
