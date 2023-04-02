// information given in a prices file
export interface PricesData {
  timestamp: number;
  price: number;
  currency: "BGN" | "EUR";
}

// information given in a usage file
export interface UsageData {
  timestamp: number;
  kwh: number;
}

export interface ParsedData {
  filename: string;
  parsedData: (PricesData | UsageData)[];
}

export interface GroupedUsageData {
  [pointId: string | number]: ParsedData[];
}
