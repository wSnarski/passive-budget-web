import type { Projection } from '../../types/api';
import { formatCurrency, relativeTime } from '../../utils/format';
import WhatIfForm from './WhatIfForm';

interface Props {
  projection: Projection | null;
  loading: boolean;
  error: string | null;
}

export default function ProjectionCard({ projection, loading, error }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="h-6 bg-gray-200 animate-pulse rounded w-48 mb-6" />
        <div className="grid grid-cols-3 gap-4 my-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="text-center">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-16 mx-auto mb-2" />
              <div className="h-8 bg-gray-200 animate-pulse rounded w-24 mx-auto" />
            </div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
          Failed to load projection: {error}
        </div>
      </div>
    );
  }

  if (!projection) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-center text-gray-400 py-12">
          Link a bank account and sync transactions to see your monthly projection.
        </p>
      </div>
    );
  }

  const netColor = projection.projectedNet >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-semibold text-gray-900">{projection.month} Projection</h2>
        <span className="text-sm text-gray-400">Calculated {relativeTime(projection.calculatedAt)}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Income</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(projection.projectedIncome)}</p>
          {projection.actualIncome > 0 && (
            <p className="text-xs text-gray-400 mt-1">Actual: {formatCurrency(projection.actualIncome)}</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expenses</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(projection.projectedExpenses)}</p>
          {projection.actualExpenses > 0 && (
            <p className="text-xs text-gray-400 mt-1">Actual: {formatCurrency(projection.actualExpenses)}</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Net</p>
          <p className={`text-2xl font-bold ${netColor}`}>
            {projection.projectedNet >= 0 ? '+' : '-'}{formatCurrency(projection.projectedNet)}
          </p>
        </div>
      </div>

      <p className="text-center text-gray-600 italic mt-2">{projection.summary}</p>

      <WhatIfForm />
    </div>
  );
}
