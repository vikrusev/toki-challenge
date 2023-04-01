export type Time = string | number;

export interface UserInput {
  year: Time;
  month?: Time;
  day?: Time;
  meteringPointIds?: Array<string | number>;
}
