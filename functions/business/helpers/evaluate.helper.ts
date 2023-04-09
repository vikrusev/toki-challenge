import { TimeBasis } from "../../../common/dtos/UserInput.dto";
import { JsonConvertedData, Price } from "../../types/information.types";

// type guard for Price[]
const isPricesDataArray = (
    arr: JsonConvertedData["parsedData"]
): arr is Price[] => {
    return arr.every((e) => "price" in e);
};

// get average value, fixed to second digit of number elements of an array
const getArrayAverage = (values: number[]) =>
    Number(
        (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
            2
        )
    );

// get UTC representation of key to group data on
const getGroupKey = (date: Date, timeBasis: TimeBasis) => {
    if (timeBasis === "monthly") {
        return date.getUTCMonth() + 1;
    }

    if (timeBasis === "daily") {
        return date.getUTCDate();
    }

    return date.getUTCHours();
};

export { isPricesDataArray, getArrayAverage, getGroupKey };
