import type{ CurrencyDisplay } from './types';

export function toNumberSafe(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function formatAmount(v: unknown, currency?: CurrencyDisplay): string {
  const n = toNumberSafe(v);
  if (n === 0) return `Gratuit (0${currency ? ' ' + currency : ''})`;
  if (n == null) return 'Non communiqué';
  const num = new Intl.NumberFormat('fr-FR').format(n);
  return currency ? `${num} ${currency}` : num;
}

export function truthy<T>(x: T | null | undefined): x is T { return Boolean(x); }

export const ENABLE_SCORE_MODE_DEMO = (import.meta.env.VITE_ENABLE_SCORE_MODE === 'true');
