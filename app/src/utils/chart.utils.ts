import { TimeBasis, UserInput } from "../../../common/dtos/UserInput.dto";

// sequentially pickable colors for Bars in a BarChart
export const chartDataColors = [
    "#db8c8c",
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
    datetime,
    timeBasis,
    meteringPointIds,
}: UserInput) => {
    const functionDomain =
        process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_CLOUD_FUNCTION_URL
            : "http://localhost:8080";

    let url = `${functionDomain}/?datetime=${datetime}&timeBasis=${timeBasis}`;

    if (meteringPointIds) url += `&meteringPointIds=${meteringPointIds}`;

    return url;
};
