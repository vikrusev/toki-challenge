// clean data to be used directly on the frontend layer
export interface ClientResponse {
    datetime: number;
    datetimeKey: number;
    electricityPrice: number;
    [price: string]: number;
}
