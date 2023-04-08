export type TimeBasis = "monthly" | "daily" | "hourly";

export interface UserInput {
    datetime: number;
    timeBasis: TimeBasis;
    meteringPointIds: string; // a comma seperated list of numbers
}
