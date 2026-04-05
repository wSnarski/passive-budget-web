import { useState } from 'react';
import type { RecurringPattern } from '../../types/api';
import { formatAmount, amountColor } from '../../utils/format';

interface Props {
  patterns: RecurringPattern[];
  loading: boolean;
  onConfirm: (id: string) => void;
  onDismiss: (id: string) => void;
}

export default function RecurringList({ patterns, loading, onConfirm, onDismiss }: Props) {
  const [showIncome, setShowIncome] = useState(true);
  const [showExpenses, setShowExpenses] = useState(true);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-32 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />)}
        </div>
      </div>
    );
  }

  const visible = patterns.filter(p => p.isActive && !p.isInternalTransfer);
  const inflows = visible.filter(p => p.direction === 'inflow');
  const outflows = visible.filter(p => p.direction === 'outflow');

  const renderItem = (p: RecurringPattern) => {
    const isLowConfidence = p.confidence < 0.7;
    const dotColor = isLowConfidence
      ? 'bg-yellow-400'
      : p.direction === 'inflow'
        ? 'bg-green-500'
        : 'bg-red-500';

    return (
      <div key={p.id} className="py-3 border-b border-gray-50 last:border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <span className={`w-2 h-2 rounded-full ${dotColor} mr-2 shrink-0`} />
            <span className="text-sm font-medium text-gray-900 truncate">{p.merchantName || p.name}</span>
          </div>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <span className={`text-sm font-semibold ${amountColor(p.averageAmount)}`}>
              {formatAmount(p.averageAmount)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.frequency}</span>
          </div>
        </div>
        {isLowConfidence && (
          <div className="ml-4 mt-1">
            <button onClick={() => onConfirm(p.id)} className="text-xs text-green-600 hover:text-green-700 font-medium mr-3">
              Confirm
            </button>
            <button onClick={() => onDismiss(p.id)} className="text-xs text-red-600 hover:text-red-700 font-medium">
              Dismiss
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Recurring</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowIncome(!showIncome)}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            showIncome ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setShowExpenses(!showExpenses)}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            showExpenses ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Expenses
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Sync transactions to detect recurring income and expenses.</p>
      ) : (
        <div className="space-y-1">
          {showIncome && inflows.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Income</p>
              {inflows.map(renderItem)}
            </div>
          )}
          {showExpenses && outflows.length > 0 && (
            <div className={showIncome && inflows.length > 0 ? 'mt-4' : ''}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Expenses</p>
              {outflows.map(renderItem)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
