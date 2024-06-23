import axios from "axios";
import { TaxResponse } from "./taxCalculatorApiModel";

export const fetchTaxRates = async (year: number): Promise<TaxResponse> => {
  try {
    const response = await axios.get<TaxResponse>(`/tax-calculator/tax-year/${year}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch tax rates. Please try again later.');
  }
};