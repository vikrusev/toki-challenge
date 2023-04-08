// TOKI's buket name
export const BUCKET_NAME = "toki-take-home.appspot.com";

// name of the secret stored in Google Cloud Secret Manager
export const SECRET_NAME = "toki-service-account";

// mounted volume path of secrets within Google Cloud Functions
export const SECRET_KEYFILENAME_PATH_PROD = "/secrets";

// get a pointId out of a usage file
// the regex matches as a group digits, which are followed by .jsonl
// e.g. usage/2022/04/01/1234.jsonl will match 1234
export const POINTID_REGEX = /(\d+)\.jsonl$/;

// get 'YYYY/MM/DD' time from a filename
//e.g. we can get `2022/04/1` from usage/2022/04/1/1234.jsonl or prices/2022/04/01.jsonl
export const YEAR_MONTH_DAY_REGEX = /(\d{4})\/(\d{2})\/((\d{2})|(\d{1}))/;

// regex to catch a string representation of array elements joined w/ `,`
// example: '1,2,3,4' is valid, '1, 2,3' is invalid because of the space
// '[1,2,3]' is invalid because of the brackets
export const ARRAY_JOIN_COMMA = /^\d+(?:,\d+)*$/;

// inital prefixes of files in the Cloud Storage
export const FILEPATH_PREFIXES = {
    prices: "prices",
    usage: "usage",
};
