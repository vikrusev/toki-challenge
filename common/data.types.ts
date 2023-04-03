// information given in a prices file
export interface PricesData {
  price: number;
  timestamp: number;
  currency: "BGN" | "EUR";
  datetime?: Date | string;
}

// information given in a usage file
export interface UsageData {
  timestamp: number;
  kwh: number;
  datetime?: Date | string;
}

export interface ParsedData {
  filename: string;
  parsedData: (PricesData | UsageData)[];
}

export interface GroupedUsageData {
  [pointId: string]: UsageData[];
}

export interface AggregatedData {
  [datetime: string]: number[];
}

export interface Response {
  datetime: Date | string;
  value: number;
}

export interface ClientResponse {
  pricesData: Response[];
  usageData: {
    pointId: string;
    data: Response[];
  }[];
}
