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

/**
 * Calculates the total tax and details for a given annual income and tax brackets.
 *
 * @param annualIncome - The annual income for which the tax is to be calculated.
 * @param taxBrackets - The tax brackets applicable for the calculation.
 * @returns An object containing the total tax and the tax details for each bracket.
 *
 * The function iterates through the tax brackets and calculates the tax for each bracket
 * based on the provided annual income. It returns the total tax and an array of tax details
 * for each bracket.
 */
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

  return {
    totalTax,
    taxDetails,
  };
};

/**
 * Calculates the effective tax rate based on the total tax and annual income.
 *
 * @param totalTax - The total tax calculated for the annual income.
 * @param annualIncome - The annual income for which the tax is calculated.
 * @returns The effective tax rate as a percentage.
 *
 * The function calculates the effective tax rate by dividing the total tax by the annual income
 * and multiplying the result by 100. The result is rounded to two decimal places.
 */
export const calculateEffectiveRate = (
  totalTax: number,
  annualIncome: number
): number => {
  if (annualIncome === 0) return 0;
  return parseFloat(((totalTax / annualIncome) * 100).toFixed(2));
};
