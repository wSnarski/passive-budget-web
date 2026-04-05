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
  const limit = 25;

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

  const clearFilters = () => {
    setAccountId('');
    setCategory('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const hasFilters = accountId || category || startDate || endDate;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Transactions</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={accountId}
          onChange={e => { setAccountId(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
          className="px-3 py-2 border border-gray-300 rounded-md text-sm w-40"
        />
        <input
          type="date"
          value={startDate}
          onChange={e => { setStartDate(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm w-36"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => { setEndDate(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm w-36"
        />
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
                <div className="h-4 bg-gray-200 animate-pulse rounded flex-1" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">No transactions found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-4 pb-3 pt-4 w-28">Date</th>
                <th className="px-4 pb-3 pt-4">Name</th>
                <th className="px-4 pb-3 pt-4 w-32">Category</th>
                <th className="px-4 pb-3 pt-4 w-28 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr
                  key={t.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    t.isInternalTransfer ? 'text-gray-400' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {t.merchantName || t.name}
                    </span>
                    {t.pending && <span className="text-xs text-yellow-600 ml-1">(pending)</span>}
                    {t.isInternalTransfer && <span className="text-xs text-gray-400 ml-1">transfer</span>}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === t.id ? (
                      <input
                        type="text"
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleRecategorize(t.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        onBlur={() => handleRecategorize(t.id)}
                        className="text-sm border border-blue-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => { setEditingId(t.id); setEditCategory(t.category || ''); }}
                        className="text-sm text-gray-600 hover:text-blue-600 text-left"
                        title="Click to edit category"
                      >
                        {t.category || '—'} <span className="text-gray-300 text-xs">✏</span>
                      </button>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold text-right ${amountColor(t.amount)}`}>
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
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>
          {(() => {
            const total = pagination.pages;
            const delta = 2;
            const pages: (number | '...')[] = [];
            const left = Math.max(2, page - delta);
            const right = Math.min(total - 1, page + delta);
            pages.push(1);
            if (left > 2) pages.push('...');
            for (let i = left; i <= right; i++) pages.push(i);
            if (right < total - 1) pages.push('...');
            if (total > 1) pages.push(total);
            return pages.map((p, idx) =>
              p === '...' ? (
                <span key={`ellipsis-${idx}`} className="text-gray-400">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`px-3 py-1 text-sm rounded ${
                    p === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              )
            );
          })()}
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page >= pagination.pages}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
          <span className="text-sm text-gray-500 ml-2">Page {pagination.currentPage} of {pagination.pages}</span>
        </div>
      )}
    </div>
  );
}
