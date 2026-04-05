import type { Account } from '../../types/api';
import { formatAmount } from '../../utils/format';

interface Props {
  accounts: Account[];
  loading: boolean;
}

export default function AccountList({ accounts, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-24 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  const grouped = accounts.reduce<Record<string, Account[]>>((acc, a) => {
    const type = a.type || 'other';
    (acc[type] = acc[type] || []).push(a);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Accounts</h3>
      {accounts.length === 0 ? (
        <p className="text-sm text-gray-500">No accounts linked yet.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([type, accts]) => (
            <div key={type}>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{type}</p>
              <div className="space-y-1">
                {accts.map(a => (
                  <div key={a.id} className={`flex justify-between items-center py-1.5 ${!a.isActive ? 'opacity-50' : ''}`}>
                    <div>
                      <p className="text-sm text-gray-900">{a.name}</p>
                      {a.officialName && <p className="text-xs text-gray-400">{a.officialName}</p>}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {a.currentBalance !== null ? formatAmount(a.currentBalance, false) : '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
