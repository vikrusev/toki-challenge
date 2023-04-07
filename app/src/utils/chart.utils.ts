import { InputTime } from "../../../common/dtos/UserInput.dto";

interface UrlBuildData {
    dateOptions: InputTime;
    meteringPointIds: string[];
}

// sequentially pickable colors for Bars in a BarChart
export const chartDataColors = [
    "#eeb8b8",
    "#c5dad1",
    "#aeddef",
    "#c9cbe0",
    "#cfdd8e",
    "#72b7b2",
    "#dadafc",
    "#b279a2",
    "#ff9da6",
    "#668cff",
];

const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUNE",
    "JULE",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
];

/**
 * Basic tick formatter based on the InputTime
 * Transforms @param value to month names, if 'month' and 'day' are not given
 * Transforms @param value to end in 'st', 'nd', 'rd', 'th' if only 'day' is not given
 * Transforms @param value to end in 'am' or 'pm' if `month` and `day` are given
 * @param value - value to transform
 * @param dateOptions - InputTime data
 */
export const tickFormatter = (value: number, dateOptions?: InputTime) => {
    // Hourly data
    if (
        dateOptions?.day &&
        dateOptions?.month &&
        dateOptions?.day !== "default" &&
        dateOptions?.month !== "default"
    )
        return value <= 11 ? `${value}am` : `${value}pm`;

    // Daily data
    if (dateOptions?.month && dateOptions?.month !== "default") {
        if (value >= 10 && value <= 20) return `${value}th`;

        switch (value?.toString().slice(-1)) {
            case "1":
                return `${value}st`;
            case "2":
                return `${value}nd`;
            case "3":
                return `${value}rd`;
            default:
                return `${value}th`;
        }
    }

    // Monthly data
    return monthNames[+value - 1];
};

/**
 * Creates an array w/ 2 character digits w/ trailing zero, starting from '01'
 * @param untilNumber
 * @returns an array of string
 */
export const createArray = (untilNumber: number) =>
    Array.from({ length: untilNumber }, (_, i) =>
        String(i + 1).padStart(2, "0")
    );

/**
 * Builds a URL to fetch user data from
 * @param param0 - different query arguments - dates and metering point ids
 */
export const buildUrl = ({ dateOptions, meteringPointIds }: UrlBuildData) => {
    let url = `http://localhost:8080/?year=${dateOptions.year}`;

    if (meteringPointIds.length && meteringPointIds.filter(Boolean).length)
        url += `&meteringPointIds=${meteringPointIds.join(",")}`;

    if (dateOptions.month !== "default") {
        url += `&month=${dateOptions.month}`;
        if (dateOptions.day !== "default") url += `&day=${dateOptions.day}`;
    }

    return url;
};
