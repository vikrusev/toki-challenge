// clean data to be used directly on the frontend layer
export interface ClientResponse {
    datetime: number;
    electricityPrice: number;
    [key: string]: number;
}
