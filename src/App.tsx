import React, { useState } from "react";

import "./App.scss";
import { fetchTaxRates } from "./apis/taxCalculatorApi";
import {
  MAX_TAX_YEAR,
  MIN_TAX_YEAR,
  calculateEffectiveRate,
  calculateTotalTax,
} from "./utils/taxCalculator";

const App: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState<number>(0);
  const [taxYear, setTaxYear] = useState<number>(MAX_TAX_YEAR);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateInputs = (): boolean => {
    if (isNaN(annualIncome) || annualIncome <= 0) {
      setError("Please enter a valid annual income.");
      return false;
    }

    if (isNaN(taxYear) || taxYear < MIN_TAX_YEAR || taxYear > MAX_TAX_YEAR) {
      setError(
        `Please enter a valid tax year (${MIN_TAX_YEAR}-${MAX_TAX_YEAR}).`
      );
      return false;
    }

    return true;
  };

  const handleCalculateTax = async (event: React.FormEvent) => {
    event.preventDefault();
    setResult('');
    setError('');

    if (!validateInputs()) return;

    try {
      const taxResponse = await fetchTaxRates(taxYear);
      const { totalTax, taxDetails } = calculateTotalTax(annualIncome, taxResponse.tax_brackets);
      const effectiveRate = calculateEffectiveRate(totalTax, annualIncome);

      setResult(`Total tax: $${totalTax.toFixed(2)}\n${taxDetails}Effective tax rate: ${effectiveRate.toFixed(2)}%`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="container">
      <h1>Income Tax Calculator</h1>
      <form onSubmit={handleCalculateTax}>
        <div className="form-group">
          <label className="form-label" htmlFor="annualIncome">
            Annual Income
          </label>
          <input
            className="form-input"
            type="number"
            id="annualIncome"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(parseFloat(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="taxYear">
            Tax Year
          </label>
          <select
            className="form-input"
            id="taxYear"
            value={taxYear}
            onChange={(e) => setTaxYear(parseInt(e.target.value))}
          >
            {Array.from(
              { length: MAX_TAX_YEAR - MIN_TAX_YEAR + 1 },
              (_, i) => MIN_TAX_YEAR + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button className="form-submit" type="submit">
          Calculate Tax
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && <pre className="result">{result}</pre>}
    </div>
  );
};

export default App;
