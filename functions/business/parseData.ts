import { DownloadResponse } from "@google-cloud/storage";
import { FILEPATH_PREFIXES, POINTID_REGEX } from "../config/constants";
import {
  AggregatedData,
  ClientResponse,
  GroupedUsageData,
  ParsedData,
  PricesData,
  UsageData,
} from "../../common/data.types";
import { InputTime, Time } from "../dtos/UserInput.dto";

type FileData = {
  filename: string;
  data: DownloadResponse;
};

// type guard for PricesData
const isPricesData = (el: ParsedData["parsedData"]): el is PricesData[] => {
  return el.every((e) => "price" in e);
};

// type guard for UsageData
const isUsageData = (el: ParsedData["parsedData"]): el is UsageData[] => {
  return el.every((e) => "kwh" in e);
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
  return usageDataFiles.reduce(
    (result: GroupedUsageData, { filename, parsedData }) => {
      const pointId = filename.match(POINTID_REGEX)![1];

      if (!result[pointId]) result[pointId] = [];
      result[pointId].push(...(parsedData as UsageData[]));

      return result;
    },
    {} as GroupedUsageData
  );
};

const aggregateAverageRecords = (
  data: (
    | Pick<PricesData, "price" | "datetime">
    | Pick<UsageData, "kwh" | "datetime">
  )[],
  month?: Time
) => {
  const aggregatedPricesRecords = data.reduce((acc, data) => {
    const date = new Date(data.datetime!);
    const key = month ? `${date.getDate()}` : `${date.getMonth() + 1}`;
    if (!(key in acc)) acc[key] = [];
    acc[key].push("price" in data ? data.price : data.kwh);
    return acc;
  }, {} as AggregatedData);

  return Object.entries(aggregatedPricesRecords).map(([date, values]) => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return {
      datetime: date,
      price: Number((sum / values.length).toFixed(2)),
    };
  });
};

/**
 * Keep only properties that are needed by the business layer
 * @returns ready for ClientResponse data objects
 */
const cleanData = (
  pricesData: ParsedData[],
  groupedUsageData: GroupedUsageData
): ClientResponse => {
  const cleanedPricesData = pricesData
    .flatMap(({ parsedData }) => parsedData)
    .map(({ timestamp, price }) => ({
      datetime: new Date(timestamp!),
      price: price,
    }));

  const cleanedUsageData = Object.entries(groupedUsageData).map(
    ([pointId, data]) => ({
      pointId,
      data: data.map(({ timestamp, kwh }) => ({
        datetime: new Date(timestamp),
        kwh,
      })),
    })
  );

  return {
    pricesData: cleanedPricesData,
    usageData: cleanedUsageData,
  };
};

/**
 * Executes 4 stages of data parsing
 * Stage #1 - seperate prices from usage data files
 * Stage #2 - read file contents and parse them to JS objects
 * Stage #3 - groups usage data by metering pointIds
 * Stage #4 - cleans data to be consistent and use only what is needed
 * @returns ready for ClientResponse data
 */
const parseAndDistributeData = (files: FileData[]): ClientResponse => {
  // Stage #1 - filter prices and usage data
  const pricesDataFiles = files.filter(({ filename }) =>
    filename.startsWith(FILEPATH_PREFIXES.prices)
  );
  const usageDataFiles = files.filter(({ filename }) =>
    filename.startsWith(FILEPATH_PREFIXES.usage)
  );

  // Stage #2 - parse content of the .jsonl files also assure types with type guards
  const pricesData = parseData(pricesDataFiles).map(
    ({ filename, parsedData }) => ({
      filename,
      parsedData: isPricesData(parsedData) ? parsedData : [],
    })
  );

  const usageData = parseData(usageDataFiles).map(
    ({ filename, parsedData }) => ({
      filename,
      parsedData: isUsageData(parsedData) ? parsedData : [],
    })
  );

  // Stage #3 - group usage datas by pointId
  const groupedUsageData = groupUsageDataByPointId(usageData);

  // Stage #4 - return cleaned data / use only what is needed
  return cleanData(pricesData, groupedUsageData);
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
): ClientResponse => {
  // parse raw prices and usage data
  const { pricesData, usageData } = parseAndDistributeData(files);

  // if day is specified, return the result so far
  if (day) {
    return {
      pricesData,
      usageData,
    };
  }

  // otherwise aggregate obtained data and calculate average values
  const averagedPricesRecords = aggregateAverageRecords(pricesData, month);

  const averagedUsageData = usageData.map(({ pointId, data }) => ({
    pointId,
    data: aggregateAverageRecords(data, month),
  }));

  return {
    pricesData: averagedPricesRecords,
    usageData: averagedUsageData,
  };
};

export default parsePriceUsageData;
