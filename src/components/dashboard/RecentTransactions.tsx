import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Transaction } from '../../types/api';
import { listTransactions } from '../../api/transactions';
import { formatAmount, amountColor, formatDate } from '../../utils/format';

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listTransactions({ limit: 10, offset: 0 })
      .then(res => setTransactions(res.transactions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
        <Link to="/transactions" className="text-xs text-indigo-600 hover:underline">View all</Link>
      </div>
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500">No transactions yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between py-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 truncate">{t.merchantName || t.name}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(t.date)}
                  {t.category && <> &middot; {t.category}</>}
                </p>
              </div>
              <span className={`text-sm font-medium ml-2 ${amountColor(t.amount)}`}>
                {formatAmount(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
