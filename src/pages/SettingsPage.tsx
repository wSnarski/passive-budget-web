import { useState, useEffect, useCallback } from 'react';
import type { PlaidItem } from '../types/api';
import { listPlaidItems, removePlaidItem, syncTransactions } from '../api/plaid';
import { detectRecurring } from '../api/recurring';
import { recalculateProjection } from '../api/projections';
import { useAccounts } from '../hooks/useAccounts';
import { usePlaidLinkFlow } from '../hooks/usePlaidLink';
import { formatCurrency, relativeTime } from '../utils/format';

export default function SettingsPage() {
  const [items, setItems] = useState<PlaidItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const { accounts, toggle, refetch: refetchAccounts } = useAccounts();

  const fetchItems = useCallback(async () => {
    setItemsLoading(true);
    try {
      setItems(await listPlaidItems());
    } catch {
    } finally {
      setItemsLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handlePlaidSuccess = useCallback(() => {
    fetchItems();
    refetchAccounts();
  }, [fetchItems, refetchAccounts]);

  const { open: openPlaid } = usePlaidLinkFlow(handlePlaidSuccess);

  const showSuccess = (key: string) => {
    setActionSuccess(key);
    setTimeout(() => setActionSuccess(null), 2000);
  };

  const handleSync = async (plaidItemId: string) => {
    setActionLoading(`sync-${plaidItemId}`);
    try {
      await syncTransactions(plaidItemId);
      showSuccess(`sync-${plaidItemId}`);
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (plaidItemId: string) => {
    if (!confirm('Remove this institution? This will delete all associated data.')) return;
    setActionLoading(`remove-${plaidItemId}`);
    try {
      await removePlaidItem(plaidItemId);
      setItems(prev => prev.filter(i => i.plaidItemId !== plaidItemId));
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  const handleDetect = async () => {
    setActionLoading('detect');
    try {
      await detectRecurring();
      showSuccess('detect');
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecalculate = async () => {
    setActionLoading('recalculate');
    try {
      await recalculateProjection();
      showSuccess('recalculate');
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      {/* Linked Institutions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Linked Institutions</h2>
        {itemsLoading ? (
          <div className="space-y-2">
            {[1, 2].map(i => <div key={i} className="h-14 bg-gray-200 animate-pulse rounded" />)}
          </div>
        ) : (
          <>
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No institutions linked.</p>
            ) : (
              <div>
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.institutionName || 'Unknown Institution'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs ${item.status === 'good' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-400">Last synced: {relativeTime(item.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {actionSuccess === `sync-${item.plaidItemId}` ? (
                        <span className="text-sm text-green-600 font-medium px-3 py-1">Done ✓</span>
                      ) : (
                        <button
                          onClick={() => handleSync(item.plaidItemId)}
                          disabled={actionLoading === `sync-${item.plaidItemId}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 disabled:opacity-50"
                        >
                          {actionLoading === `sync-${item.plaidItemId}` ? 'Syncing...' : 'Sync'}
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(item.plaidItemId)}
                        disabled={actionLoading === `remove-${item.plaidItemId}`}
                        className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => openPlaid()}
              className="w-full border-2 border-dashed border-gray-300 text-gray-500 rounded-lg py-3 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium mt-4"
            >
              + Link New Institution
            </button>
          </>
        )}
      </div>

      {/* Account Toggles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Accounts</h2>
        {accounts.length === 0 ? (
          <p className="text-sm text-gray-400">No accounts to manage.</p>
        ) : (
          <div>
            {accounts.map(a => (
              <div key={a.id} className={`flex items-center justify-between py-3 ${!a.isActive ? 'opacity-60' : ''}`}>
                <div>
                  <p className="text-sm text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.type} · {a.subtype || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {a.currentBalance !== null ? formatCurrency(a.currentBalance) : '—'}
                  </span>
                  <button
                    onClick={() => toggle(a.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      a.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        a.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          {actionSuccess === 'recalculate' ? (
            <span className="px-4 py-2 text-sm text-green-600 font-medium">Done ✓</span>
          ) : (
            <button
              onClick={handleRecalculate}
              disabled={actionLoading === 'recalculate'}
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {actionLoading === 'recalculate' ? 'Recalculating...' : 'Recalculate Projections'}
            </button>
          )}
          {actionSuccess === 'detect' ? (
            <span className="px-4 py-2 text-sm text-green-600 font-medium">Done ✓</span>
          ) : (
            <button
              onClick={handleDetect}
              disabled={actionLoading === 'detect'}
              className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              {actionLoading === 'detect' ? 'Detecting...' : 'Re-detect Recurring'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
