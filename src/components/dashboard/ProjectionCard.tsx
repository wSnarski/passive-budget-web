import type { Projection } from '../../types/api';
import { formatAmount } from '../../utils/format';
import WhatIfForm from './WhatIfForm';

interface Props {
  projection: Projection | null;
  loading: boolean;
  error: string | null;
}

export default function ProjectionCard({ projection, loading, error }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-sm text-red-600">Failed to load projection: {error}</p>
      </div>
    );
  }

  if (!projection) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-gray-500 text-sm">No projection yet. Link a bank account and sync transactions to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-6 text-white">
      <h2 className="text-lg font-semibold mb-1">Monthly Projection</h2>
      <p className="text-indigo-200 text-sm mb-4">{projection.month}</p>
      <p className="text-sm text-indigo-100 mb-4">{projection.summary}</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-indigo-200 uppercase tracking-wide">Income</p>
          <p className="text-xl font-bold">{formatAmount(projection.projectedIncome, false)}</p>
          {projection.actualIncome > 0 && (
            <p className="text-xs text-indigo-200">Actual: {formatAmount(projection.actualIncome, false)}</p>
          )}
        </div>
        <div>
          <p className="text-xs text-indigo-200 uppercase tracking-wide">Expenses</p>
          <p className="text-xl font-bold">{formatAmount(projection.projectedExpenses, false)}</p>
          {projection.actualExpenses > 0 && (
            <p className="text-xs text-indigo-200">Actual: {formatAmount(projection.actualExpenses, false)}</p>
          )}
        </div>
        <div>
          <p className="text-xs text-indigo-200 uppercase tracking-wide">Net</p>
          <p className={`text-xl font-bold ${projection.projectedNet >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {formatAmount(projection.projectedNet, false)}
          </p>
        </div>
      </div>

      <WhatIfForm />
    </div>
  );
}
