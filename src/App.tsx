import React, { useState } from "react";

import "./App.scss";

const App: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("");
  const [result, setResult] = useState<string>("");

  const handleCalculateTax = (event: React.FormEvent) => {
    event.preventDefault();

    const income = parseFloat(annualIncome);
    const year = parseInt(taxYear);

    if (isNaN(income) || income <= 0) {
      setResult("Please enter a valid annual income.");
      return;
    }

    if (isNaN(year) || year <= 0) {
      setResult("Please enter a valid tax year.");
      return;
    }

    // Assuming a simple flat tax rate of 20% for demonstration
    const taxRate = 0.2;
    const totalTax = income * taxRate;

    setResult(
      `The total income tax for the year ${year} is $${totalTax.toFixed(2)}.`
    );
  };

  return (
    <div className="container">
      <h1>Income Tax Calculator</h1>
      <form onSubmit={handleCalculateTax}>
        <div className="form-group">
          <label className="form-label"
          htmlFor="annualIncome">Annual Income: </label>
          <input
            className="form-input"
            type="number"
            id="annualIncome"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label"
          htmlFor="taxYear">Tax Year: </label>
          <input
            className="form-input"
            type="number"
            id="taxYear"
            value={taxYear}
            onChange={(e) => setTaxYear(e.target.value)}
          />
        </div>
        <button className="form-submit" type="submit">
          Calculate Tax
        </button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
};

export default App;
