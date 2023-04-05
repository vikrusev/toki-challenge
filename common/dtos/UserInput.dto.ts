export type Time = string | number;

export type InputTime = Pick<UserInput, "year" | "month" | "day">;

export interface UserInput {
    year: Time;
    month: Time;
    day: Time;
    meteringPointIds: string; // a comma seperated list of numbers
}
