/**
 * Indian financial year: April 1 (startCalendarYear) → March 31 (startCalendarYear + 1),
 * labelled as YY-YY two-digit end year, e.g. 2026-27 for FY spanning Apr 2026 – Mar 2027.
 * Lists derive from today's date so new years roll in automatically on refresh/build.
 */

const DEFAULT_FINANCIAL_YEARS_BACK = 15;
const DEFAULT_FINANCIAL_YEARS_AHEAD = 1;
const DEFAULT_CALENDAR_YEARS_BACK = 20;
const DEFAULT_CALENDAR_YEARS_AHEAD = 1;

export function getIndianFinancialYearStartCalendarYear(date = new Date()): number {
  const y = date.getFullYear();
  return date.getMonth() >= 3 ? y : y - 1;
}

export function formatIndianFinancialYear(startCalendarYear: number): string {
  const next = startCalendarYear + 1;
  return `${startCalendarYear}-${String(next).slice(-2)}`;
}

/** FY that contains `date` (most forms should default here, not next FY). */
export function getDefaultIndianFinancialYearLabel(date = new Date()): string {
  return formatIndianFinancialYear(getIndianFinancialYearStartCalendarYear(date));
}

export function parseIndianFinancialYearLabel(label: string): number | null {
  const m = /^(\d{4})-(\d{2})$/.exec(label.trim());
  if (!m) return null;
  const start = Number(m[1]);
  const endTwo = Number(m[2]);
  const expectedEndTwo = Number(String(start + 1).slice(-2));
  if (!Number.isFinite(start) || endTwo !== expectedEndTwo) return null;
  return start;
}

export function buildFinancialYearOptions(opts?: {
  /** Reference date — defaults to “today” when omitted */
  referenceDate?: Date;
  /** Extra FYs beyond the FY that contains `referenceDate` (e.g. 1 → include next FY) */
  yearsAhead?: number;
  /** How many past FYs to include (plus the FY containing referenceDate). */
  yearsBack?: number;
}): string[] {
  const date = opts?.referenceDate ?? new Date();
  const yearsAhead = opts?.yearsAhead ?? DEFAULT_FINANCIAL_YEARS_AHEAD;
  const yearsBack = opts?.yearsBack ?? DEFAULT_FINANCIAL_YEARS_BACK;
  const currentStart = getIndianFinancialYearStartCalendarYear(date);
  const maxStart = currentStart + yearsAhead;
  const minStart = currentStart - yearsBack;
  const out: string[] = [];
  for (let start = maxStart; start >= minStart; start--) {
    out.push(formatIndianFinancialYear(start));
  }
  return out;
}

export const FINANCIAL_YEAR_OPTIONS = buildFinancialYearOptions();

/** Newest FY in the default dropdown (includes lookahead years). */
export function getLatestListedFinancialYearLabel(
  opts?: Parameters<typeof buildFinancialYearOptions>[0],
): string {
  const optsList = opts ? buildFinancialYearOptions(opts) : FINANCIAL_YEAR_OPTIONS;
  return optsList[0] ?? getDefaultIndianFinancialYearLabel();
}

export function buildCalendarYearOptions(opts?: {
  referenceDate?: Date;
  yearsAhead?: number;
  yearsBack?: number;
}): string[] {
  const date = opts?.referenceDate ?? new Date();
  const y = date.getFullYear();
  const yearsAhead = opts?.yearsAhead ?? DEFAULT_CALENDAR_YEARS_AHEAD;
  const yearsBack = opts?.yearsBack ?? DEFAULT_CALENDAR_YEARS_BACK;
  const max = y + yearsAhead;
  const min = y - yearsBack;
  const out: string[] = [];
  for (let cy = max; cy >= min; cy--) {
    out.push(String(cy));
  }
  return out;
}

export const CALENDAR_YEAR_OPTIONS = buildCalendarYearOptions();
