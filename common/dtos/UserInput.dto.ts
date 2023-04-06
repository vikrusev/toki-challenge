export type InputTime = Pick<UserInput, "year" | "month" | "day">;

export interface UserInput {
    year: string;
    month: string;
    day: string;
    meteringPointIds: string; // a comma seperated list of numbers
}
