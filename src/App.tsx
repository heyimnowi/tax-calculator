import React, { useState } from "react";
import "./App.scss";
import { fetchTaxRates } from "./apis/taxCalculatorApi";
import {
  calculateTotalTax,
  calculateEffectiveRate,
  MIN_TAX_YEAR,
  MAX_TAX_YEAR,
  TaxCalculationResult,
} from "./utils/taxCalculator";
import TaxForm from "./components/TaxForm/TaxForm";
import TaxResult from "./components/TaxResult/TaxResult";

const App: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState<number>(0);
  const [taxYear, setTaxYear] = useState<number>(MAX_TAX_YEAR);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    setResult(null);
    setError("");
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      const taxResponse = await fetchTaxRates(taxYear);
      const { totalTax, taxDetails } = calculateTotalTax(annualIncome, taxResponse.tax_brackets);
      const effectiveRate = calculateEffectiveRate(totalTax, annualIncome);

      setResult({ totalTax, effectiveRate, taxDetails });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Income Tax Calculator</h1>
      <TaxForm
        annualIncome={annualIncome}
        taxYear={taxYear}
        loading={loading}
        onIncomeChange={setAnnualIncome}
        onYearChange={setTaxYear}
        onSubmit={handleCalculateTax}
      />
      <TaxResult result={result} error={error} />
    </div>
  );
};

export default App;
