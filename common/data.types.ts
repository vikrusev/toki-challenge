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

export interface PricesResponse {
  datetime: Date | string;
  price: number;
}

export interface UsageResponse {
  pointId: string;
  data: Pick<UsageData, "datetime" | "kwh">[];
}

export interface ClientResponse {
  pricesData: PricesResponse[];
  usageData: UsageResponse[];
}
