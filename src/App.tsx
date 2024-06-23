import React, { useState, useEffect } from "react";
import "./App.scss";
import {
  calculateTotalTax,
  calculateEffectiveRate,
  MIN_TAX_YEAR,
  MAX_TAX_YEAR,
  TaxCalculationResult,
} from "./utils/taxCalculator";
import TaxForm from "./components/TaxForm/TaxForm";
import TaxResult from "./components/TaxResult/TaxResult";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxRatesByYear } from "./redux/taxSlice";
import { RootState, AppDispatch } from "./redux/store";

const App: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState<number>(0);
  const [taxYear, setTaxYear] = useState<number>(MAX_TAX_YEAR);
  const [result, setResult] = useState<TaxCalculationResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const taxState = useSelector((state: RootState) => state.tax);

  useEffect(() => {
    if (taxState.status === "failed") {
      setError(taxState.error || "");
    }
  }, [taxState.status, taxState.error]);

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

  const calculateTax = (taxResponse: any) => {
    const { totalTax, taxDetails } = calculateTotalTax(
      annualIncome,
      taxResponse.tax_brackets
    );
    const effectiveRate = calculateEffectiveRate(totalTax, annualIncome);

    setResult({ totalTax, effectiveRate, taxDetails });
  };

  /**
   * Handles the calculation of tax when the form is submitted.
   *
   * @param event - The form submission event.
   *
   * This function prevents the default form submission behavior, resets the result and error state,
   * and sets the loading state to true. It validates the inputs and if they are invalid, it sets the
   * loading state to false and exits.
   *
   * If the tax rates for the selected tax year are not cached in the Redux store, it dispatches an action
   * to fetch the tax rates from the API. If the tax rates are already cached, it directly calculates the tax
   * using the cached data.
   *
   * The function calculates the tax by calling the `calculateTax` function with the fetched or cached tax rates.
   */
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
      if (!taxState.taxRates[taxYear]) {
        await dispatch(fetchTaxRatesByYear(taxYear)).unwrap();
      }
      if (taxState.taxRates[taxYear]) {
        calculateTax(taxState.taxRates[taxYear]);
      }
    } catch (error) {
      setError("Failed to fetch tax rates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taxState.status === "succeeded" && taxState.taxRates[taxYear]) {
      calculateTax(taxState.taxRates[taxYear]);
    } else if (taxState.status === "failed") {
      setError(taxState.error || "");
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxState.status, taxState.taxRates, taxYear]);

  // Clear results when inputs change
  const handleIncomeChange = (income: number) => {
    setAnnualIncome(income);
    setResult(null);
    setError("");
  };

  const handleYearChange = (year: number) => {
    setTaxYear(year);
    setResult(null);
    setError("");
  };

  return (
    <div className="container">
      <h1>Income Tax Calculator</h1>
      <TaxForm
        annualIncome={annualIncome}
        taxYear={taxYear}
        loading={loading}
        onIncomeChange={handleIncomeChange}
        onYearChange={handleYearChange}
        onSubmit={handleCalculateTax}
      />
      <TaxResult result={result} error={error} />
    </div>
  );
};

export default App;
