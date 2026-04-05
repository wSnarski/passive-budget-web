import { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useAccounts } from '../hooks/useAccounts';
import { formatAmount, amountColor, formatDate } from '../utils/format';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [accountId, setAccountId] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState('');
  const limit = 20;

  const filters = useMemo(() => ({
    accountId: accountId || undefined,
    category: category || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  }), [accountId, category, startDate, endDate]);

  const { transactions, pagination, loading, recategorize } = useTransactions(page, limit, filters);
  const { accounts } = useAccounts();

  const handleRecategorize = async (id: string) => {
    if (editCategory.trim()) {
      await recategorize(id, editCategory.trim());
      setEditingId(null);
      setEditCategory('');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Transactions</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select
            value={accountId}
            onChange={e => { setAccountId(e.target.value); setPage(1); }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none"
          >
            <option value="">All accounts</option>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none"
          />
          <input
            type="date"
            value={startDate}
            onChange={e => { setStartDate(e.target.value); setPage(1); }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => { setEndDate(e.target.value); setPage(1); }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No transactions found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map(t => (
                <tr key={t.id} className={`hover:bg-gray-50 ${t.isInternalTransfer ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">{t.merchantName || t.name}</p>
                    {t.pending && <span className="text-xs text-yellow-600">Pending</span>}
                    {t.isInternalTransfer && <span className="text-xs text-gray-400 ml-1">Transfer</span>}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === t.id ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={editCategory}
                          onChange={e => setEditCategory(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleRecategorize(t.id)}
                          className="rounded border border-gray-300 px-2 py-1 text-xs w-28 outline-none"
                          autoFocus
                        />
                        <button onClick={() => handleRecategorize(t.id)} className="text-xs text-indigo-600">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingId(t.id); setEditCategory(t.category || ''); }}
                        className="text-sm text-gray-600 hover:text-indigo-600 text-left"
                      >
                        {t.category || '—'}
                      </button>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium text-right ${amountColor(t.amount)}`}>
                    {formatAmount(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {pagination.total} transactions &middot; Page {pagination.currentPage} of {pagination.pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
