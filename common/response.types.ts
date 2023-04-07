import {
    AggregatedData,
    UnifiedPriceUsage,
} from "../functions/types/information.types";

// clean data to be used directly on the frontend layer
export interface ClientResponse extends UnifiedPriceUsage {
    electricityPrice: number;
    datetimeKey: AggregatedData["datetimeKey"];
}
