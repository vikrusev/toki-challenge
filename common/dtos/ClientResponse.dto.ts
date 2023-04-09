import { IncreasedPriceCycle } from "../../functions/business/findIncreasedPriceCycles";

// type of prices and usage data sent to client
export interface PricesUsageData {
    datetime: number;
    datetimeKey: number;
    electricityPrice: number;
    [price: string]: number;
}

// clean data to be used directly on the frontend layer
export interface ClientResponse {
    pricesUsageData: PricesUsageData[];
    increasedPriceCycles: IncreasedPriceCycle[];
}
