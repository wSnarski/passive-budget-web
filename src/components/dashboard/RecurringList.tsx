import type { RecurringPattern } from '../../types/api';
import { formatAmount, amountColor } from '../../utils/format';

interface Props {
  patterns: RecurringPattern[];
  loading: boolean;
  onConfirm: (id: string) => void;
  onDismiss: (id: string) => void;
}

export default function RecurringList({ patterns, loading, onConfirm, onDismiss }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  const active = patterns.filter(p => p.isActive && !p.isInternalTransfer);
  const inflows = active.filter(p => p.direction === 'inflow');
  const outflows = active.filter(p => p.direction === 'outflow');

  const renderItem = (p: RecurringPattern) => (
    <div key={p.id} className="flex items-center justify-between py-1.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-900 truncate">{p.merchantName || p.name}</p>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {p.frequency}
          </span>
        </div>
        {p.category && <p className="text-xs text-gray-400">{p.category}</p>}
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span className={`text-sm font-medium ${amountColor(p.averageAmount)}`}>
          {formatAmount(p.averageAmount)}
        </span>
        {p.confidence < 0.8 && (
          <div className="flex gap-1">
            <button onClick={() => onConfirm(p.id)} className="text-xs text-green-600 hover:underline">confirm</button>
            <button onClick={() => onDismiss(p.id)} className="text-xs text-red-500 hover:underline">dismiss</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Recurring</h3>
      {active.length === 0 ? (
        <p className="text-sm text-gray-500">No recurring patterns detected yet.</p>
      ) : (
        <div className="space-y-3">
          {inflows.length > 0 && (
            <div>
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Income</p>
              {inflows.map(renderItem)}
            </div>
          )}
          {outflows.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-1">Expenses</p>
              {outflows.map(renderItem)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
