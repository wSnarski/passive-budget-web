import { useState } from 'react';
import { useWhatIf } from '../../hooks/useWhatIf';
import { formatAmount } from '../../utils/format';

export default function WhatIfForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const { result, loading, error, calculate, reset } = useWhatIf();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!isNaN(num)) {
      calculate(num, category || undefined);
    }
  };

  return (
    <div className="border-t border-indigo-500 pt-4">
      <p className="text-xs text-indigo-200 uppercase tracking-wide mb-2">What-If Calculator</p>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex-1 rounded-md px-3 py-1.5 text-sm text-gray-900 bg-white/90 border-0 outline-none placeholder-gray-400"
        />
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="flex-1 rounded-md px-3 py-1.5 text-sm text-gray-900 bg-white/90 border-0 outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading || !amount}
          className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Calculate'}
        </button>
      </form>

      {error && <p className="text-xs text-red-300">{error}</p>}

      {result && (
        <div className="bg-white/10 rounded-md p-3 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-indigo-200">Current net:</span>
            <span>{formatAmount(result.currentNet, false)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-indigo-200">After:</span>
            <span>{formatAmount(result.afterNet, false)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-indigo-200">Impact:</span>
            <span className={result.impact >= 0 ? 'text-green-300' : 'text-red-300'}>
              {formatAmount(result.impact, false)}
            </span>
          </div>
          <p className="text-xs text-indigo-200 mt-2">{result.summary}</p>
          <button onClick={reset} className="text-xs text-indigo-200 underline mt-1">Clear</button>
        </div>
      )}
    </div>
  );
}
