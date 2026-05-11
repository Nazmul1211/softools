export interface TaxBracket {
  cap: number;
  rate: number;
}

export function calculateProgressiveTax(
  taxableIncome: number,
  brackets: TaxBracket[]
): number {
  let remaining = Math.max(0, taxableIncome);
  let previousCap = 0;
  let tax = 0;

  for (const bracket of brackets) {
    const taxableAtBand = Math.min(remaining, bracket.cap - previousCap);
    if (taxableAtBand <= 0) break;
    tax += taxableAtBand * bracket.rate;
    remaining -= taxableAtBand;
    previousCap = bracket.cap;
  }

  return tax;
}

export function toPayPeriods(netAnnual: number) {
  return {
    monthly: netAnnual / 12,
    biweekly: netAnnual / 26,
    weekly: netAnnual / 52,
  };
}

export function formatCurrency(
  value: number,
  currency: string,
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
