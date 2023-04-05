// matches a string which consists of only numbers, seperated by a single comma
// and as many whitespaces as needed between before and after the commas
// example: '1234' or '1234,5678' or '1234  ,5678' or '1234,  5678'
export const METERING_POINTIDS_REGEX = /^\s*\d+\s*(,\s*\d+\s*)*$/;

// matches all whitespaces in a string
export const WHITESPACE_REGEX = /\s+/g;
