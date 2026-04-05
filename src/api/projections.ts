import { get, post } from './client';
import type { Projection, WhatIfResponse } from '../types/api';

export function getMonthlyProjection(month?: string) {
  const params: Record<string, string> = {};
  if (month) params.month = month;
  return get<Projection>('/projection/monthly', params);
}

export function whatIf(amount: number, category?: string) {
  return post<WhatIfResponse>('/projection/what-if', { amount, category });
}

export function recalculateProjection(month?: string) {
  return post<Projection>('/projection/recalculate', month ? { month } : {});
}
