import { DownloadResponse } from "@google-cloud/storage";
import { FILEPATH_PREFIXES, PricesData, UsageData } from "../config/constants";
import { InputTime } from "../dtos/UserInput.dto";

type FileData = {
  filename: string;
  data: DownloadResponse;
};

/**
 * Parse JsonL data and map to TypeScript objects
 * @returns an array w/ parsed data and mapped to objects
 */
const parseData = (files: FileData[]) => {
  // loop each given file
  const parsedPricesDataFiles = files.map((file) => {
    // parse lines and filter empty lines if any
    const lines = file.data.toString().split("\n");
    const parsedData = lines
      .map((line): PricesData & UsageData => line && JSON.parse(line))
      .filter((el) => el);

    return {
      filename: file.filename,
      parsedData,
    };
  });

  return parsedPricesDataFiles;
};

/**
 * Parses files data and aggregates the information
 * It can be aggregated on a Daily, Monthly and Yearly basis
 *
 * @param files - prices and eventually usage data files
 * @param param1 - times provided by the user input
 * @returns an aggregated final version of data based on @param param1
 */
const aggregatePriceUsageData = (
  files: FileData[],
  { year, month, day }: InputTime
) => {
  const pricesDataFiles = files.filter(({ filename }) =>
    filename.startsWith(FILEPATH_PREFIXES.prices)
  );

  const usageDataFiles = files.filter(({ filename }) =>
    filename.startsWith(FILEPATH_PREFIXES.usage)
  );

  const parsedPricesData = parseData(pricesDataFiles);
  const parsedUsageData = parseData(usageDataFiles);

  return {
    parsedPricesData,
    parsedUsageData,
  };
};

export default aggregatePriceUsageData;
