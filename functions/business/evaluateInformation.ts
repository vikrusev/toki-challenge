import { POINTID_REGEX } from "../config/constants";
import {
    DownloadedCloudFile,
    Price,
    Usage,
    JsonConvertedData,
    UnifiedPriceUsage,
    AggregatedData,
} from "../types/information.types";
import { TimeBasis } from "../../common/dtos/UserInput.dto";
import { ClientResponse } from "../../common/response.types";
import {
    getGroupKey,
    getArrayAverage,
    isPricesDataArray,
} from "./helpers/evaluate.helper";

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
 * Make structure of Price and Usage objects the same
 * They should both have a field for  "time" and a field for "price"
 */
const unifyPricesAndUsageData = (
    files: JsonConvertedData[]
): UnifiedPriceUsage[] => {
    return files.flatMap(({ filename, parsedData }) => {
        // the "price" field in price entries should be 'electricityPrice'
        if (isPricesDataArray(parsedData)) {
            return parsedData.map((data) => ({
                datetime: data.timestamp,
                electricityPrice: data.price,
            }));
        }

        // we are sure that there is a match, because the non-isPricesData
        // files have pointId in the end of the filename
        const pointId = filename.match(POINTID_REGEX)?.[1] || "unknown";
        return (parsedData as Usage[]).map((data) => ({
            datetime: data.timestamp,
            [pointId]: data.kwh,
        }));
    });
};

/**
 * Groups data based on @param timeBasis
 * Either on Hourly, Daily or Monthly basis
 * Also, adds a property datetimeKey of the key data was grouped by
 */
const groupByTimeInput = (
    data: UnifiedPriceUsage[],
    timeBasis: TimeBasis
): AggregatedData[] => {
    // get an object w/ keys - groupKey and value of a aggregated Price or Usage values
    const result = data.reduce(
        (acc, { electricityPrice, datetime, ...pointIdDatas }) => {
            const date = new Date(datetime);
            const key = getGroupKey(date, timeBasis);

            // prepare initial datetime field, which is a must-have
            acc[key] = acc[key] || {
                datetime,
                datetimeKey: +key,
                electricityPrice: [],
            };

            // if the data entry is prices, we will have electricityPrice
            if (electricityPrice) {
                acc[key].electricityPrice.push(electricityPrice);
            }

            // otherwise loop metering point datas
            Object.entries(pointIdDatas).forEach(([pointId, values]) => {
                acc[key][pointId] = acc[key][pointId] || [];
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
 * Calculate average electricity price and metering points values for each Month / Hour / Day
 */
const calculateAverageValues = (data: AggregatedData[]): ClientResponse[] => {
    return data.map(
        ({ datetimeKey, datetime, electricityPrice, ...pointIdData }) => {
            const averageElectricityPrice = getArrayAverage(electricityPrice);

            // averaged usage data
            const averagedPointIdData = Object.entries(pointIdData).reduce(
                (acc, [pointId, values]) => ({
                    ...acc,
                    [pointId]: getArrayAverage(values),
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
 * Read and evalue downloaded cloud file information
 *
 * @param files - downloaded prices and usage data files
 * @param timeInput - times provided by the user input, year is not needed
 * @returns an array w/ transformed cloud information to frontend-based structure
 *  - Monthly, Daily or Hourly averages are calculated based on @param timeInput
 */
const evaluateInformation = (
    files: DownloadedCloudFile[],
    timeBasis: TimeBasis
): ClientResponse[] => {
    // convert data to JS objects
    const parsedFiles = convertRawUsageAndPricesDataToJson(files);

    // unify prices and usage objects
    const standardizedData = unifyPricesAndUsageData(parsedFiles);

    // get simple objects of prices and usage w/ Monthly, Daily or Hourly values
    const groupedEntries = groupByTimeInput(standardizedData, timeBasis);

    // calculate average prices and usage values
    return calculateAverageValues(groupedEntries);
};

export default evaluateInformation;
