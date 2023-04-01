import { Storage, Bucket, StorageOptions } from "@google-cloud/storage";

import { BUCKET_NAME } from "../config/constants";
import { UserInput, Time } from "../dtos/UserInput.dto";

class CloudStorageClient {
  // a Bucket connected to TOKI's Google Cloud Storage
  private bucket: Bucket;

  // inital prefixes of files in the Cloud Storage
  private readonly filepathPrefixes = {
    prices: "prices",
    usage: "usage",
  };

  constructor(storageOptions: StorageOptions) {
    this.bucket = this.getStorageBucket(BUCKET_NAME, storageOptions);
  }

  /**
   * Constructs a Storage client and returns a reference to TOKI's Google Cloud Storage Bucket
   * @param {string} bucketName - name of bucket
   * @param {StorageOptions} options
   * @returns a reference to a bucket
   */
  getStorageBucket = (bucketName: string, options: StorageOptions): Bucket => {
    return new Storage(options).bucket(bucketName);
  };

  /**
   * Download prices and eventually usage data files for a specific day
   * @param {UserInput} param0 - defining the specific day and eventually the metering point ids
   * @returns an object w/ prices for the specific day and eventually
   *  the consumption of each of the given metering points
   */
  getUserData = async ({ meteringPointIds, ...times }: UserInput) => {
    const timePrefixPrices = this.timePaddedPrefixPrices(times);
    const timePrefixUsage = this.timePaddedPrefixUsage(times);

    const pricesFile = `${this.filepathPrefixes.prices}/${timePrefixPrices}.jsonl`;

    // add usage files for each metering point id given
    const usageFiles =
      meteringPointIds?.split(",").map((pointId) => ({
        pointId,
        name: `${this.filepathPrefixes.usage}/${timePrefixUsage}/${pointId}.jsonl`,
      })) || [];

    // download files' data in memory
    const pricesFileData = await this.bucket.file(pricesFile).download();
    const usageFilesData = await Promise.all(
      usageFiles.map(async (file) => {
        return {
          pointId: file.pointId,
          usageData: await this.bucket.file(file.name).download(),
        };
      })
    );

    return {
      pricesFileData,
      usageFilesData,
    };
  };

  private timePaddedPrefixPrices = (
    time: Pick<UserInput, "year" | "month" | "day">
  ) => {
    const addPadding = (value: Time | undefined) =>
      value?.toString().padStart(2, "0");

    return `${time.year}/${addPadding(time.month)}/${addPadding(time.day)}`;
  };

  /**
   * Generate filepaths w/ prefixes + times for prices or usage files
   * @param {Time} time - the requested by the client time of data - year, month and day
   * @param {boolean} isForPrice - prices have a trailing zero, usages do not
   * @returns a timePaddedPrefix for either a prices or usage file
   */
  private timePaddedPrefixUsage = (
    time: Pick<UserInput, "year" | "month" | "day">
  ): string => {
    const removePadding = (value: Time | undefined) =>
      value && Number(value).toString();

    return `${time.year}/${removePadding(time.month)}/${removePadding(
      time.day
    )}`;
  };
}

export default CloudStorageClient;
