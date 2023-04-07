// clean data to be used directly on the frontend layer
export interface ClientResponse {
    datetimeKey: number;
    datetime: number;
    electricityPrice: number;
    [key: string]: number;
}
