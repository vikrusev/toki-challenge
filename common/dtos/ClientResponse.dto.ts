import { IncreasedPriceCycle } from "../../functions/business/findIncreasedPriceCycles";

// clean data to be used directly on the frontend layer
export type ClientResponse = {
    increasedPriceCycles: IncreasedPriceCycle[];
    datetime: number;
    datetimeKey: number;
    electricityPrice: number;
} & { [price: string]: number };
