import type { Account } from '../../types/api';
import { formatCurrency } from '../../utils/format';

interface Props {
  accounts: Account[];
  loading: boolean;
  onLinkBank: () => void;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function AccountList({ accounts, loading, onLinkBank }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-24 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />)}
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts</h3>
        <p className="text-center text-gray-400 py-8">Link your first bank account to get started</p>
        <button
          onClick={onLinkBank}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Link Bank Account
        </button>
      </div>
    );
  }

  const grouped = accounts.reduce<Record<string, Account[]>>((acc, a) => {
    const type = a.type || 'other';
    (acc[type] = acc[type] || []).push(a);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Accounts</h3>
        <button onClick={onLinkBank} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          + Link
        </button>
      </div>
      <div className="space-y-4">
        {Object.entries(grouped).map(([type, accts]) => {
          const groupTotal = accts.reduce((sum, a) => sum + (a.currentBalance ?? 0), 0);
          return (
            <div key={type}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {capitalize(type)}
              </p>
              <div>
                {accts.map(a => (
                  <div
                    key={a.id}
                    className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 ${
                      !a.isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{a.name}</p>
                      {a.officialName && a.officialName !== a.name && (
                        <p className="text-xs text-gray-400">{a.officialName}</p>
                      )}
                      {!a.isActive && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">inactive</span>
                      )}
                    </div>
                    <p className={`text-sm font-semibold ${type === 'credit' ? 'text-red-600' : 'text-gray-900'}`}>
                      {a.availableBalance !== null
                        ? formatCurrency(a.availableBalance)
                        : a.currentBalance !== null
                          ? formatCurrency(a.currentBalance)
                          : '—'}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 font-medium text-right mt-1">
                {formatCurrency(groupTotal)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
