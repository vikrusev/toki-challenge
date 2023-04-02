import { Storage, Bucket, StorageOptions } from "@google-cloud/storage";

import {
  BUCKET_NAME,
  FILEPATH_PREFIXES,
  POINTID_REGEX,
} from "../config/constants";
import { InputTime, UserInput } from "../dtos/UserInput.dto";
import { addPadding, removePadding } from "./helpers/datePrefix.helper";

class CloudStorageClient {
  // a Bucket connected to TOKI's Google Cloud Storage
  private bucket: Bucket;

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
   * Download prices and eventually usage data files for all days based on the user input
   * @param {UserInput} param0 - defining time and eventually the metering point ids
   * @returns an array w/ mapped filenames w/ their data
   */
  getUserData = async ({ meteringPointIds, ...times }: UserInput) => {
    // prepare prefixes
    const timePrefixPrices = this.timePaddedPrefixPrices(times);
    const timePrefixUsage = this.timePaddedPrefixUsage(times);

    // get all available files in the Cloud Storage
    const [availableCloudFiles] = await this.bucket.getFiles();

    // filter the filenames we want to download
    const toDownloadFiles = availableCloudFiles.filter((file) => {
      // check if the file is for prices
      if (file.name.startsWith(timePrefixPrices)) return true;

      // check if the file is for usage and is for some of the requested metering points
      if (meteringPointIds && file.name.startsWith(`${timePrefixUsage}/`)) {
        const pointId = file.name.match(POINTID_REGEX)![1];
        return meteringPointIds.split(",").includes(pointId);
      }

      return false;
    });

    // download the files
    return await Promise.all(
      toDownloadFiles.map(async (file) => ({
        filename: file.name,
        data: await file.download(),
      }))
    );
  };

  /**
   * Generate filepath prefix w/ times for prices
   * @param {Time} time - the requested by the client time of data - year, month and day
   */
  private timePaddedPrefixPrices = (time: InputTime): string => {
    let prefix = `${FILEPATH_PREFIXES.prices}/${time.year}`;
    if (time.month) prefix += `/${addPadding(time.month)}`;
    if (time.day) prefix += `/${addPadding(time.day)}`;

    return prefix;
  };

  /**
   * Generate filepath prefix w/ times for usage
   * @param {Time} time - the requested by the client time of data - year, month and day
   */
  private timePaddedPrefixUsage = (time: InputTime): string => {
    let prefix = `${FILEPATH_PREFIXES.usage}/${time.year}`;
    if (time.month) prefix += `/${addPadding(time.month)}`;
    if (time.day) prefix += `/${removePadding(time.day)}`;

    return prefix;
  };
}

export default CloudStorageClient;
