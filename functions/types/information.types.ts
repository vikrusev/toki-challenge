import { DownloadResponse } from "@google-cloud/storage";

// information about a downloaded cloud file
export interface DownloadedCloudFile {
    filename: string;
    data: DownloadResponse;
}

// information given in a prices file
export interface Price {
    price: number;
    timestamp: number;
    currency: "BGN" | "EUR";
}

// information given in a usage file
export interface Usage {
    timestamp: number;
    kwh: number;
}

// data parsed to JS objects
export interface JsonConvertedData {
    filename: string;
    parsedData: (Price | Usage)[];
}

// simplify price and usage data
export interface UnifiedPriceUsage {
    datetime: number;
    [price: string]: number;
}

// aggregated data w/ combined prices and usage datas
export interface AggregatedData {
    datetimeKey: number;
    datetime: number;
    electricityPrice: number[];
    [pointId: string]: number[] | number;
}
