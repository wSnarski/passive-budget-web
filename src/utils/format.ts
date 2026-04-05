/**
 * Format a currency amount for display.
 * Plaid convention: positive = outflow (expense), negative = inflow (income).
 * We invert for display: expenses shown as negative/red, income as positive/green.
 */
export function formatAmount(amount: number, invert = true): string {
  const display = invert ? -amount : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'auto',
  }).format(display);
}

export function amountColor(amount: number, invert = true): string {
  const display = invert ? -amount : amount;
  if (display > 0) return 'text-green-600';
  if (display < 0) return 'text-red-600';
  return 'text-gray-600';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
