import { POINTID_REGEX } from "../config/constants";
import {
    DownloadedCloudFile,
    Price,
    Usage,
    JsonConvertedData,
    UnifiedPriceUsage,
    AggregatedData,
} from "../types/information.types";
import { InputTime } from "../../common/dtos/UserInput.dto";
import { ClientResponse } from "../../common/response.types";

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
const getGroupKey = (date: Date, { month, day }: InputTime) =>
    day && month
        ? `${date.getUTCHours()}`
        : month
        ? `${date.getUTCDate()}`
        : `${date.getUTCMonth() + 1}`;

/**
 * Parse JsonL data and map to TypeScript objects
 * @returns an array w/ parsed and mapped to objects data
 */
const convertRawUsageAndPricesDataToJson = (
    files: DownloadedCloudFile[]
): JsonConvertedData[] => {
    // loop each given file
    return files.map(({ data, filename }) => {
        // parse lines and filter empty lines if any
        const lines = data.toString().split("\n");
        const parsedData = lines
            .map(
                (line): JsonConvertedData["parsedData"][0] =>
                    line && JSON.parse(line)
            )
            .filter(Boolean);

        return {
            filename,
            parsedData,
        };
    });
};

/**
 * Groups data based on @param timeInput
 * Either on Hourly, Daily or Monthly basis
 * Also, adds a property datetimeKey of the key data was grouped by
 * @param timeInput - month and day are both optional, used to define the group key
 *  - if month is not given - group on Monthly basis
 *  - if month is given, day is not - group on Daily basis
 *  - if month and day are given - group on Hourly basis
 */
const groupData = (
    data: UnifiedPriceUsage[],
    timeInput: InputTime
): AggregatedData[] => {
    // use reduce to get an object w/ keys a group key
    // and value an object of datetime, array of electricity prices
    // and eventually arrays of the available metering points
    const result = data.reduce(
        (acc, { electricityPrice, datetime, ...pointIdDatas }) => {
            const date = new Date(datetime);
            const key = getGroupKey(date, timeInput);

            // prepare initial datetime field, which is a must-have
            acc[key] = acc[key] || { datetime, datetimeKey: key };

            // if the data entry is prices, we will have electricityPrice
            if (electricityPrice) {
                acc[key].electricityPrice = acc[key].electricityPrice || [];
                acc[key].electricityPrice.push(electricityPrice);
            }

            // otherwise loop metering point datas
            Object.entries(pointIdDatas).forEach(([pointId, values]) => {
                acc[key][pointId] = acc[key][pointId] || [];
                // @ts-ignore
                acc[key][pointId].push(values);
            });

            return acc;
        },
        {} as Record<string, AggregatedData>
    );

    // finally, remove the keys and leave the values only
    return Object.values(result);
};

/**
 * Calculate average electricity price and metering points values for each Hour / Day / Month
 */
const calculateAverageValues = (data: AggregatedData[]): ClientResponse[] => {
    return data.map(
        ({ datetimeKey, datetime, electricityPrice, ...pointIdData }) => {
            const averageElectricityPrice = getArrayAverage(electricityPrice);

            const averagedPointIdData = Object.entries(pointIdData).reduce(
                (acc, [pointId, values]) => ({
                    ...acc,
                    [pointId]: getArrayAverage(values as number[]),
                }),
                {} as Record<string, number>
            );

            return {
                datetimeKey,
                datetime,
                electricityPrice: averageElectricityPrice,
                ...averagedPointIdData,
            };
        }
    );
};

/**
 * Keep only properties that are needed by the frontend layer
 * w/ proper names
 */
const unifyPricesAndUsageData = (
    data: JsonConvertedData[]
): UnifiedPriceUsage[] => {
    return data.flatMap(({ filename, parsedData }) => {
        if (isPricesDataArray(parsedData)) {
            return parsedData.map((data) => ({
                datetime: data.timestamp,
                electricityPrice: data.price,
            }));
        }

        // we are sure that there is a match, because the non-isPricesData
        // files have pointId in the end of the filename
        const pointId = filename.match(POINTID_REGEX)![1];
        return (parsedData as Usage[]).map((data) => ({
            datetime: data.timestamp,
            [pointId]: data.kwh,
        }));
    });
};

/**
 * The function undergoes 4 stages
 *  - #1 Parses files data
 *  - #2 Cleans data to use only properties, required by the frontend
 *  - #3 Groups entries by datetime
 *      - can be on Hourly, Daily or Monthly basis
 *  - #4 Averages values of electricity price and consumptions
 *
 * @param files - prices and eventually usage data files
 * @param param1 - times provided by the user input, year is not needed
 * @returns an array representation of Prices and Usage data
 * based on @param param1, ready to be used by the frontend layer
 */
const evaluateRequestedData = (
    files: DownloadedCloudFile[],
    timeInput: InputTime
): ClientResponse[] => {
    // parse raw prices and usage data
    const parsedFiles = convertRawUsageAndPricesDataToJson(files);

    // unify prices and usage data
    const standardizedData = unifyPricesAndUsageData(parsedFiles);

    // group data by time
    const groupedEntries = groupData(standardizedData, timeInput);

    // calculate average values
    return calculateAverageValues(groupedEntries);
};

export default evaluateRequestedData;
