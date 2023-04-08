import { TimeBasis } from "../../../common/dtos/UserInput.dto";

interface UrlBuildData {
    date: Date;
    timeBasis: TimeBasis;
    meteringPointIds: string;
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
export const tickFormatter = (value: number, timeBasis: TimeBasis) => {
    // Hourly data
    if (timeBasis === "hourly")
        return value <= 11 ? `${value}am` : `${value}pm`;

    // Daily data
    if (timeBasis === "daily") {
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
 * Builds a URL to fetch user data from
 * @param param0 - different query arguments - dates and metering point ids
 */
export const buildFetchUrl = ({
    date,
    timeBasis,
    meteringPointIds,
}: UrlBuildData) => {
    let url = `http://localhost:8080/?year=${date.getFullYear()}`;

    if (timeBasis === "daily") {
        url += `&month=${date.getMonth() + 1}`;
    }

    if (timeBasis === "hourly") {
        url += `&month=${date.getMonth() + 1}&day=${date.getDate()}`;
    }

    if (meteringPointIds?.split(","))
        url += `&meteringPointIds=${meteringPointIds}`;

    return url;
};
