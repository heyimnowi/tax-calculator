import { TaxBracket } from "../apis/taxCalculatorApiModel";

export const MIN_TAX_YEAR = 2019;
export const MAX_TAX_YEAR = 2022;

export const calculateTotalTax = (
  annualIncome: number,
  taxBrackets: TaxBracket[]
): { totalTax: number; taxDetails: string } => {
  let totalTax = 0;
  let taxDetails = "";

  for (const bracket of taxBrackets) {
    if (annualIncome > bracket.min) {
      const taxableIncome = bracket.max
        ? Math.min(annualIncome, bracket.max) - bracket.min
        : annualIncome - bracket.min;
      const taxForBracket = taxableIncome * bracket.rate;
      totalTax += taxForBracket;
      taxDetails += `Income between $${bracket.min.toFixed(2)} and $${
        bracket.max ? bracket.max.toFixed(2) : "above"
      } taxed at ${(bracket.rate * 100).toFixed(2)}%: $${taxForBracket.toFixed(
        2
      )}\n`;
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
