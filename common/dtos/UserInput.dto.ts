export type TimeBasis = "monthly" | "daily" | "hourly";

export interface UserInput {
    date: Date;
    timeBasis: TimeBasis;
    meteringPointIds: string; // a comma seperated list of numbers
}
