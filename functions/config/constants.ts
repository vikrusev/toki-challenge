// TOKI's buket name
export const BUCKET_NAME = "toki-take-home.appspot.com";

// name of the secret stored in Google Cloud Secret Manager
export const SECRET_NAME = "toki-service-account";

// mounted volume path of secrets within Google Cloud Functions
export const SECRET_KEYFILENAME_PATH_PROD = "/secrets";

// inital prefixes of files in the Cloud Storage
export const FILEPATH_PREFIXES = {
  prices: "prices",
  usage: "usage",
};

// information given in a prices file
export interface PricesData {
  timestamp: number;
  price: number;
  currency: "BGN" | "EUR";
}

// information given in a usage file
export interface UsageData {
  timestamp: number;
  kwh: number;
}
