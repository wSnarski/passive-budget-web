export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Account {
  id: string;
  userId: string;
  plaidAccountId: string;
  name: string;
  officialName?: string;
  type: string;
  subtype?: string;
  currentBalance: number | null;
  availableBalance: number | null;
  isoCurrencyCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  plaidTransactionId: string | null;
  amount: number;
  date: string;
  name: string;
  merchantName: string | null;
  category: string | null;
  plaidCategory: string[] | null;
  pending: boolean;
  isInternalTransfer: boolean;
  recurringTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  pages: number;
  currentPage: number;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

export interface RecurringPattern {
  id: string;
  userId: string;
  accountId: string | null;
  name: string;
  merchantName: string;
  averageAmount: number;
  frequency: string;
  direction: string;
  category: string | null;
  lastOccurrence: string;
  nextExpectedDate: string;
  isActive: boolean;
  isInternalTransfer: boolean;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface Projection {
  id: string;
  userId: string;
  month: string;
  projectedIncome: number;
  projectedExpenses: number;
  actualIncome: number;
  actualExpenses: number;
  projectedNet: number;
  calculatedAt: string;
  summary: string;
}

export interface WhatIfResponse {
  currentNet: number;
  afterNet: number;
  impact: number;
  willStillSave: boolean;
  summary: string;
}

export interface PlaidItem {
  id: string;
  userId: string;
  plaidItemId: string;
  institutionId?: string;
  institutionName?: string;
  status: string;
  consentExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeTokenResponse {
  plaidItem: PlaidItem;
  accounts: Account[];
}

export interface ApiError {
  error: {
    message: string;
    statusCode: number;
  };
}
