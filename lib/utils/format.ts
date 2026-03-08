/**
 * Format a number as Vietnamese currency with thousands separators.
 * Example: 1000000 → "1.000.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

/**
 * Format a number as Vietnamese currency with the đồng symbol.
 * Example: 1000000 → "1.000.000 ₫"
 */
export function formatPrice(amount: number): string {
  return formatCurrency(amount) + ' ₫';
}

/**
 * Parse a formatted currency string back to a number.
 * Removes all non-digit characters except minus sign.
 * Example: "1.000.000" → 1000000
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d-]/g, '');
  return parseInt(cleaned, 10) || 0;
}
