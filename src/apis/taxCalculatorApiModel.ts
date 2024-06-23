export interface TaxBracket {
  min: number;
  max?: number;
  rate: number;
}

export interface TaxResponse {
  tax_brackets: TaxBracket[];
}
