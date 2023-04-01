export type Time = string | number;

export interface UserInput {
  year: Time;
  month?: Time;
  day?: Time;
  meteringPointIds?: string; // the array will be encoded in a comma seperated list of strings
}
