import { TaxBracket } from "../apis/taxCalculatorApiModel";

export const MIN_TAX_YEAR = 2019;
export const MAX_TAX_YEAR = 2022;

export interface TaxDetail {
  range: string;
  rate: number;
  taxAmount: number;
}

export interface TaxCalculationResult {
  totalTax: number;
  effectiveRate: number;
  taxDetails: TaxDetail[];
}

export const calculateTotalTax = (
  annualIncome: number,
  taxBrackets: TaxBracket[]
): { totalTax: number; taxDetails: TaxDetail[] } => {
  let totalTax = 0;
  let taxDetails: TaxDetail[] = [];

  for (const bracket of taxBrackets) {
    if (annualIncome > bracket.min) {
      const taxableIncome = bracket.max
        ? Math.min(annualIncome, bracket.max) - bracket.min
        : annualIncome - bracket.min;
      const taxForBracket = taxableIncome * bracket.rate;
      totalTax += taxForBracket;

      taxDetails.push({
        range: `$${bracket.min.toFixed(2)} - ${
          bracket.max ? `$${bracket.max.toFixed(2)}` : "above"
        }`,
        rate: bracket.rate * 100,
        taxAmount: taxForBracket,
      });
    }
  }

  return { totalTax, taxDetails };
};

export const calculateEffectiveRate = (
  totalTax: number,
  annualIncome: number
): number => {
  return (totalTax / annualIncome) * 100;
};
