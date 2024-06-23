import { calculateTotalTax, calculateEffectiveRate } from "../taxCalculator";
import { TaxBracket } from "../../apis/taxCalculatorApiModel";

// Mock tax brackets for the year 2019
const taxBrackets2019: TaxBracket[] = [
  { min: 0, max: 47630, rate: 0.15 },
  { min: 47630, max: 95259, rate: 0.205 },
  { min: 95259, max: 147667, rate: 0.26 },
  { min: 147667, max: 210371, rate: 0.29 },
  { min: 210371, rate: 0.33 },
];

// Mock tax brackets for the year 2020
const taxBrackets2020: TaxBracket[] = [
  { max: 48535, min: 0, rate: 0.15 },
  { max: 97069, min: 48535, rate: 0.205 },
  { max: 150473, min: 97069, rate: 0.26 },
  { max: 214368, min: 150473, rate: 0.29 },
  { min: 214368, rate: 0.33 },
];

describe("Tax Calculation Utilities", () => {
  it("should calculate total tax and details correctly for given income and tax brackets for 2019", () => {
    const scenarios = [
      { annualIncome: 0, totalTax: 0, details: [] },
      {
        annualIncome: 50000,
        totalTax: 7630.35,
        details: [
          { range: "$0.00 - $47630.00", rate: 15, taxAmount: 7144.5 },
          { range: "$47630.00 - $95259.00", rate: 20.5, taxAmount: 485.85 },
        ],
      },
      {
        annualIncome: 100000,
        totalTax: 18141.105,
        details: [
          { range: "$0.00 - $47630.00", rate: 15, taxAmount: 7144.5 },
          { range: "$47630.00 - $95259.00", rate: 20.5, taxAmount: 9763.945 },
          { range: "$95259.00 - $147667.00", rate: 26, taxAmount: 1232.66 },
        ],
      },
      {
        annualIncome: 1234567,
        totalTax: 386703.365,
        details: [
          { range: "$0.00 - $47630.00", rate: 15, taxAmount: 7144.5 },
          { range: "$47630.00 - $95259.00", rate: 20.5, taxAmount: 9763.945 },
          { range: "$95259.00 - $147667.00", rate: 26, taxAmount: 13626.08 },
          { range: "$147667.00 - $210371.00", rate: 29, taxAmount: 18184.16 },
          { range: "$210371.00 - above", rate: 33, taxAmount: 337984.68 },
        ],
      },
    ];

    scenarios.forEach(({ annualIncome, totalTax, details }) => {
      const result = calculateTotalTax(annualIncome, taxBrackets2019);
      expect(result.totalTax).toBeCloseTo(totalTax, 2);

      result.taxDetails.forEach((detail, index) => {
        expect(detail.range).toEqual(details[index].range);
        expect(detail.rate).toBeCloseTo(details[index].rate, 2);
        expect(detail.taxAmount).toBeCloseTo(details[index].taxAmount, 2);
      });
    });
  });

  it("should calculate the effective tax rate correctly for 2019", () => {
    const scenarios = [
      { totalTax: 0, annualIncome: 0, effectiveRate: 0 },
      { totalTax: 7630.0, annualIncome: 50000, effectiveRate: 15.26 },
      { totalTax: 17914.26, annualIncome: 100000, effectiveRate: 17.91 },
      { totalTax: 385587.65, annualIncome: 1234567, effectiveRate: 31.23 },
    ];

    scenarios.forEach(({ totalTax, annualIncome, effectiveRate }) => {
      const result = calculateEffectiveRate(totalTax, annualIncome);
      expect(result).toBeCloseTo(effectiveRate, 2);
    });
  });

  it("should calculate zero tax for zero income", () => {
    const result = calculateTotalTax(0, taxBrackets2020);
    expect(result.totalTax).toBeCloseTo(0, 2);
    expect(result.taxDetails).toEqual([]);
  });

  it("should calculate correct tax for income exactly at bracket limits", () => {
    const scenarios = [
      {
        annualIncome: 48535, // Exactly at the upper limit of the first bracket for 2020
        totalTax: 48535 * 0.15,
        details: [
          { range: "$0.00 - $48535.00", rate: 15, taxAmount: 48535 * 0.15 },
        ],
      },
      {
        annualIncome: 97069, // Exactly at the upper limit of the second bracket for 2020
        totalTax: 48535 * 0.15 + (97069 - 48535) * 0.205,
        details: [
          { range: "$0.00 - $48535.00", rate: 15, taxAmount: 48535 * 0.15 },
          {
            range: "$48535.00 - $97069.00",
            rate: 20.5,
            taxAmount: (97069 - 48535) * 0.205,
          },
        ],
      },
    ];

    scenarios.forEach(({ annualIncome, totalTax, details }) => {
      const result = calculateTotalTax(annualIncome, taxBrackets2020);
      expect(result.totalTax).toBeCloseTo(totalTax, 2);
      result.taxDetails.forEach((detail, index) => {
        expect(detail.range).toEqual(details[index].range);
        expect(detail.rate).toBeCloseTo(details[index].rate, 2);
        expect(detail.taxAmount).toBeCloseTo(details[index].taxAmount, 2);
      });
    });
  });

  it("should calculate correct tax for income exceeding the highest bracket", () => {
    const annualIncome = 300000;
    const totalTax =
      48535 * 0.15 +
      (97069 - 48535) * 0.205 +
      (150473 - 97069) * 0.26 +
      (214368 - 150473) * 0.29 +
      (300000 - 214368) * 0.33;
    const result = calculateTotalTax(annualIncome, taxBrackets2020);
    expect(result.totalTax).toBeCloseTo(totalTax, 2);
  });

  it("should handle negative income as zero tax", () => {
    const result = calculateTotalTax(-5000, taxBrackets2020);
    expect(result.totalTax).toBeCloseTo(0, 2);
    expect(result.taxDetails).toEqual([]);
  });

  it("should calculate correct tax for income equal to lower limit of a bracket", () => {
    const scenarios = [
      {
        annualIncome: 48535, // Lower limit of the second bracket for 2020
        totalTax: 48535 * 0.15,
        details: [
          { range: "$0.00 - $48535.00", rate: 15, taxAmount: 48535 * 0.15 },
        ],
      },
      {
        annualIncome: 97069, // Lower limit of the third bracket for 2020
        totalTax: 48535 * 0.15 + (97069 - 48535) * 0.205,
        details: [
          { range: "$0.00 - $48535.00", rate: 15, taxAmount: 48535 * 0.15 },
          {
            range: "$48535.00 - $97069.00",
            rate: 20.5,
            taxAmount: (97069 - 48535) * 0.205,
          },
        ],
      },
    ];

    scenarios.forEach(({ annualIncome, totalTax, details }) => {
      const result = calculateTotalTax(annualIncome, taxBrackets2020);
      expect(result.totalTax).toBeCloseTo(totalTax, 2);
      result.taxDetails.forEach((detail, index) => {
        expect(detail.range).toEqual(details[index].range);
        expect(detail.rate).toBeCloseTo(details[index].rate, 2);
        expect(detail.taxAmount).toBeCloseTo(details[index].taxAmount, 2);
      });
    });
  });
});
