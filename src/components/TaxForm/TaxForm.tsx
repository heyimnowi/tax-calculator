import React from "react";
import { ClipLoader } from "react-spinners";
import { MAX_TAX_YEAR, MIN_TAX_YEAR } from "../../utils/taxCalculator";

import "./TaxForm.scss";

const TAX_YEAR_OPTIONS = Array.from(
  { length: MAX_TAX_YEAR - MIN_TAX_YEAR + 1 },
  (_, i) => MIN_TAX_YEAR + i
);

interface TaxFormProps {
  annualIncome: number;
  taxYear: number;
  loading: boolean;
  onIncomeChange: (income: number) => void;
  onYearChange: (year: number) => void;
  onSubmit: (event: React.FormEvent) => void;
}

const TaxForm: React.FC<TaxFormProps> = ({
  annualIncome,
  taxYear,
  loading,
  onIncomeChange,
  onYearChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="annualIncome">
          Annual Income:
        </label>
        <input
          className="form-input"
          type="number"
          id="annualIncome"
          value={annualIncome}
          onChange={(e) => onIncomeChange(parseFloat(e.target.value))}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="taxYear">
          Tax Year:
        </label>
        <select
          className="form-input"
          id="taxYear"
          value={taxYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          disabled={loading}
        >
          {TAX_YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <button className="form-submit" type="submit" disabled={loading}>
        {loading ? <ClipLoader size={20} color={"#fff"} /> : "Calculate Tax"}
      </button>
    </form>
  );
};

export default TaxForm;
