import { DownloadResponse } from "@google-cloud/storage";
import {
  FILEPATH_PREFIXES,
  POINTID_REGEX,
  YEAR_MONTH_DAY_REGEX,
} from "../config/constants";
import {
  GroupedUsageData,
  ParsedData,
  SimplifiedPricesData,
  SimplifiedUsageData,
} from "../../common/data.types";
import { InputTime } from "../dtos/UserInput.dto";

type FileData = {
  filename: string;
  data: DownloadResponse;
};

/**
 * Parse JsonL data and map to TypeScript objects
 * @returns an array w/ parsed data and mapped to objects
 */
const parseData = (files: FileData[]): ParsedData[] => {
  // loop each given file
  const parsedPricesDataFiles = files.map((file) => {
    // parse lines and filter empty lines if any
    const lines = file.data.toString().split("\n");
    const parsedData = lines
      .map((line): ParsedData["parsedData"][0] => line && JSON.parse(line))
      .filter((el) => el);

    return {
      filename: file.filename,
      parsedData,
    };
  });

  return parsedPricesDataFiles;
};

/**
 * Group parsed usageDataFiles by pointId
 */
const groupUsageDataByPointId = (
  usageDataFiles: ParsedData[]
): GroupedUsageData => {
  return usageDataFiles.reduce((result: GroupedUsageData, file: ParsedData) => {
    const pointId = file.filename.match(POINTID_REGEX)![1];

    if (!result[pointId]) result[pointId] = [];
    result[pointId].push(file);

    return result;
  }, {} as GroupedUsageData);
};

/**
 * Simplifies prices and usage data to have the structure
 * { 'YYYY/MM/DD': { timestamp, price, currency }[] }
 */
const simplifyDailyData = (pricesData: ParsedData[]) => {
  return pricesData.reduce((acc, { filename, parsedData }) => {
    const [fullTime] = filename.match(YEAR_MONTH_DAY_REGEX)!;
    acc[fullTime] = parsedData;
    return acc;
  }, {} as SimplifiedPricesData);
};

const aggregate = (files: any) => {
  const result = {} as any;
  files.forEach((file: any) => {
    const day = file.filename.match(POINTID_REGEX)![1];
    const values = file.parsedData.map((data: any) => data.price);
    const sum = values.reduce((acc: number, val: number) => acc + val, 0);
    // assume we have only one currency
    result[removePadding(day)!] = (sum / values.length).toFixed(2);
  });

  return result;
};

/**
 * Parses files data and aggregates the information
 * It can be aggregated on a Daily, Monthly and Yearly basis
 *
 * @param files - prices and eventually usage data files
 * @param param1 - times provided by the user input, year is not needed
 * @returns an aggregated final version of data based on @param param1
 */
const parsePriceUsageData = (
  files: FileData[],
  { month, day }: Pick<InputTime, "month" | "day">
) => {
  // Stage #1 - filter prices and usage data
  const pricesDataFiles = files.filter(({ filename }) =>
    filename.startsWith(FILEPATH_PREFIXES.prices)
  );
  const usageDataFiles = files.filter(({ filename }) =>
    filename.startsWith(FILEPATH_PREFIXES.usage)
  );

  // Stage #2 - parse content of the .jsonl files
  const dailyPricesData = parseData(pricesDataFiles);
  const dailyUsageData = parseData(usageDataFiles);

  // Stage #3 - group usage datas by pointId
  const groupedDailyUsageData = groupUsageDataByPointId(dailyUsageData);

  // Stage #4 - simplify daily data to have nice and reusable structure
  const simplifiedDailyPricesData = simplifyDailyData(dailyPricesData);
  const simplifiedGroupedDailyUsageData = Object.assign(
    {},
    ...Object.entries(groupedDailyUsageData).map(([pointId, data]) => {
      return {
        [pointId]: simplifyDailyData(data),
      };
    })
  ) as SimplifiedUsageData;

  // Stage #5 - return Daily data
  if (day) {
    return {
      simplifiedDailyPricesData,
      simplifiedGroupedDailyUsageData,
    };
  }

  // Monthly data
  const monthlyPricesData = aggregate(dailyPricesData);
  const monthlyUsageData = aggregate(groupedDailyUsageData);

  if (month && !day) {
    return {
      monthlyPricesData,
      monthlyUsageData,
    };
  }

  // Yearly data
  // return aggregateMonths(aggregatedDaysData);
};

export default parsePriceUsageData;
