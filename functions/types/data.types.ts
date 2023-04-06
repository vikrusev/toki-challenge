import { DownloadResponse } from "@google-cloud/storage";

export interface RawFileData {
    filename: string;
    data: DownloadResponse;
}

// information given in a prices file
export interface PricesData {
    price: number;
    timestamp: number;
    currency: "BGN" | "EUR";
}

// information given in a usage file
export interface UsageData {
    timestamp: number;
    kwh: number;
}

// data parsed to JS objects
export interface ParsedData {
    filename: string;
    parsedData: (PricesData | UsageData)[];
}

// flattened RawFileData
export interface FlattenData {
    datetime: number;
    electricityPrice?: number;
    [pointId: string]: number | undefined;
}

// aggregated data w/ combined prices and usage datas
export interface FullFlattenData {
    datetime: number;
    electricityPrice: number[];
    [pointId: string]: number[] | number;
}
