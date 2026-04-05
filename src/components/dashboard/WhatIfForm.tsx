import { useState } from 'react';
import { useWhatIf } from '../../hooks/useWhatIf';
import { formatCurrency } from '../../utils/format';

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
    <div className="border-t border-gray-100 pt-4 mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">What-If Calculator</p>
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="pl-7 pr-3 py-2 border border-gray-300 rounded-md w-40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading || !amount}
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Calculate'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {result && (
        <div className="mt-3">
          <p className={`text-sm italic ${result.willStillSave ? 'text-green-600' : 'text-red-600'}`}>
            {result.summary}
          </p>
          <div className="flex gap-6 mt-2 text-sm text-gray-500">
            <span>Current net: {formatCurrency(result.currentNet)}</span>
            <span>After: {formatCurrency(result.afterNet)}</span>
            <span>Impact: {result.impact >= 0 ? '+' : '-'}{formatCurrency(result.impact)}</span>
          </div>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 mt-1">Clear</button>
        </div>
      )}
    </div>
  );
}
