import React from "react";
import { TaxCalculationResult } from "../../utils/taxCalculator";

interface TaxResultProps {
  result: TaxCalculationResult | null;
  error: string;
}

const TaxResult: React.FC<TaxResultProps> = ({ result, error }) => {
  return (
    <div>
      {error && <p className="error">{error}</p>}
      {result && (
        <div>
          <p>Total tax: ${result.totalTax.toFixed(2)}</p>
          <ul>
            {result.taxDetails.map((detail, index) => (
              <li key={index}>
                Income between {detail.range} taxed at {detail.rate.toFixed(2)}
                %: ${detail.taxAmount.toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Effective tax rate: {result.effectiveRate.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default TaxResult;
