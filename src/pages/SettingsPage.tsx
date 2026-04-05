import { useState, useEffect, useCallback } from 'react';
import type { PlaidItem } from '../types/api';
import { listPlaidItems, removePlaidItem, syncTransactions } from '../api/plaid';
import { detectRecurring } from '../api/recurring';
import { recalculateProjection } from '../api/projections';
import { useAccounts } from '../hooks/useAccounts';
import { formatDate } from '../utils/format';

export default function SettingsPage() {
  const [items, setItems] = useState<PlaidItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { accounts, toggle } = useAccounts();

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

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSync = async (plaidItemId: string) => {
    setActionLoading(`sync-${plaidItemId}`);
    try {
      await syncTransactions(plaidItemId);
      showMessage('Transactions synced successfully');
    } catch (e: any) {
      showMessage(`Sync failed: ${e.message}`);
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
      showMessage('Institution removed');
    } catch (e: any) {
      showMessage(`Remove failed: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDetect = async () => {
    setActionLoading('detect');
    try {
      await detectRecurring();
      showMessage('Recurring patterns detected');
    } catch (e: any) {
      showMessage(`Detection failed: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecalculate = async () => {
    setActionLoading('recalculate');
    try {
      await recalculateProjection();
      showMessage('Projection recalculated');
    } catch (e: any) {
      showMessage(`Recalculation failed: ${e.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      {message && (
        <div className="bg-indigo-50 text-indigo-700 text-sm rounded-md px-4 py-2">{message}</div>
      )}

      {/* Linked Institutions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Linked Institutions</h2>
        {itemsLoading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2].map(i => <div key={i} className="h-14 bg-gray-100 rounded" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">No institutions linked.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.institutionName || 'Unknown Institution'}</p>
                  <p className="text-xs text-gray-400">
                    Status: {item.status} &middot; Linked {formatDate(item.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSync(item.plaidItemId)}
                    disabled={actionLoading === `sync-${item.plaidItemId}`}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === `sync-${item.plaidItemId}` ? 'Syncing...' : 'Sync'}
                  </button>
                  <button
                    onClick={() => handleRemove(item.plaidItemId)}
                    disabled={actionLoading === `remove-${item.plaidItemId}`}
                    className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-md disabled:opacity-50 transition-colors"
                  >
                    {actionLoading === `remove-${item.plaidItemId}` ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Toggles */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Accounts</h2>
        {accounts.length === 0 ? (
          <p className="text-sm text-gray-500">No accounts to manage.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {accounts.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.type} &middot; {a.subtype || 'N/A'}</p>
                </div>
                <button
                  onClick={() => toggle(a.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    a.isActive ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      a.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDetect}
            disabled={actionLoading === 'detect'}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 transition-colors"
          >
            {actionLoading === 'detect' ? 'Detecting...' : 'Detect Recurring Patterns'}
          </button>
          <button
            onClick={handleRecalculate}
            disabled={actionLoading === 'recalculate'}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 transition-colors"
          >
            {actionLoading === 'recalculate' ? 'Recalculating...' : 'Recalculate Projection'}
          </button>
        </div>
      </div>
    </div>
  );
}
