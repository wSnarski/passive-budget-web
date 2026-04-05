import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Transaction } from '../../types/api';
import { listTransactions } from '../../api/transactions';
import { formatAmount, amountColor, formatDateShort } from '../../utils/format';

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-40 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-gray-200 animate-pulse rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <Link to="/transactions" className="text-sm text-blue-600 hover:text-blue-700">View All →</Link>
      </div>
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Sync transactions to see your spending.</p>
      ) : (
        <div>
          {transactions.map(t => (
            <div
              key={t.id}
              className={`flex items-center py-3 border-b border-gray-50 last:border-0 ${
                t.pending ? 'italic opacity-70' : ''
              }`}
            >
              <span className="text-sm text-gray-400 w-16 shrink-0">{formatDateShort(t.date)}</span>
              <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                {t.merchantName || t.name}
                {t.pending && <span className="text-xs text-yellow-600 ml-1">(pending)</span>}
              </span>
              <span className="text-xs text-gray-400 w-24 text-right">{t.category || ''}</span>
              <span className={`text-sm font-semibold text-right w-24 ${amountColor(t.amount)}`}>
                {formatAmount(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
