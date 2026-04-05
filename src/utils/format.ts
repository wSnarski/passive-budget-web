/**
 * Format an amount for display.
 * When flip=true (default), treats as Plaid convention (positive=outflow) and inverts.
 * When flip=false, displays the amount as-is (for projections, balances).
 */
export function formatAmount(amount: number, flip = true): string {
  const displayAmount = flip ? -amount : amount;
  const sign = displayAmount >= 0 ? '+' : '-';
  return `${sign}$${Math.abs(displayAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

/**
 * Return a Tailwind color class for a Plaid amount.
 * Positive Plaid amount = outflow = red, negative = inflow = green.
 */
export function amountColor(plaidAmount: number): string {
  return plaidAmount > 0 ? 'text-red-600' : 'text-green-600';
}

/**
 * Format a currency value that's already in normal convention (e.g., projection amounts).
 * Do NOT flip these — they're not in Plaid convention.
 */
export function formatCurrency(amount: number): string {
  return `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
