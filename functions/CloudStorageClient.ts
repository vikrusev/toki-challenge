import { Bucket } from "@google-cloud/storage";

import { BUCKET_NAME } from "./constants/constants";
import { UserInput, Time } from "./models/UserInput.model";

import getServiceAccountBucket from "./getServiceAccountBucket";

class CloudStorageClient {
  // a Bucket connected to TOKI's Google Cloud Storage
  private bucket: Bucket;

  // inital prefixes of files in the Cloud Storage
  private readonly filepathPrefixes = {
    prices: "prices",
    usage: "usage",
  };

  /**
   * Init CloudStorageClient object by making a deep copy of the passed bucket,
   * because otherwise it will be just a reference to the outside bucket
   *
   * We use a static build function to instantiate an object of this class
   * because we want this.bucket to be created from within the object
   *
   * This way we are preserving the encapsulation of private members
   *
   * We cannot have an async constructor for this and we do not want to have
   * an additional init() method to create the bucket reference
   * @param {Bucket} bucket - bucket object to Google Cloud
   */
  private constructor(bucket: Bucket) {
    this.bucket = Object.assign({}, bucket, {
      metadata: { ...bucket.metadata },
      storage: { ...bucket.storage },
    });
  }

  /**
   * The idea is not to break encapsulation by having and exposed reference
   * to the private member this.bucket
   * @returns a Promise of a CloudStorageClient initialisation
   */
  static async buildClient() {
    const storageBucket = await getServiceAccountBucket(
      BUCKET_NAME,
      Boolean(process.env.CI_PROD)
    );

    return new CloudStorageClient(storageBucket);
  }

  /**
   * Gets requested by the client data
   * This can be the prices and eventually usage for some time
   * @param {UserInput} userInput - consisting of times and optional metering point ids
   */
  getUserData = async (userInput: UserInput) => {
    // get price and eventually usage data
    const filesData = await this.getFilesData(userInput);
    return filesData;
  };

  /**
   * Get either Daily, Monthly or Yearly data for the prices
   * Monthly takes averages of the Daily
   * Yearly takes averages of Monthly
   * @param {UserInput} uesrInput - data of request
   */
  private getFilesData = async (userInput: UserInput) => {
    // prepare proper format of month and day variables
    const month = userInput.month && this.getProperTimePadding(userInput.month);
    const day = userInput.day && this.getProperTimePadding(userInput.day);

    if (userInput.year && month && day) {
      return await this.downloadDailyData(userInput);
    }

    if (userInput.year && month) {
      return await this.getMonthlyData();
    }

    if (userInput.year) {
      return await this.getYearlyData();
    }

    throw new Error("User Input has on year specified.");
  };

  /**
   * Download prices and eventually usage data files for a specific day
   * @param {UserInput} param0 - defining the specific day and eventually the metering point ids
   * @returns an object w/ prices for the specific day and eventually
   *  the consumption of each of the given metering points
   */
  private downloadDailyData = async ({
    year,
    month,
    day,
    meteringPointIds,
  }: UserInput) => {
    const timePrefix = `${year}/${month}/${day}`;
    const pricesFile = `${this.filepathPrefixes.prices}/${timePrefix}.jsonl`;

    // add usage files for each metering point id given
    const usageFiles: { pointId: string | number; name: string }[] = [];
    meteringPointIds?.forEach((pointId) =>
      usageFiles.push({
        pointId,
        name: `${this.filepathPrefixes.usage}/${timePrefix}/${pointId}.jsonl`,
      })
    );

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

  private getMonthlyData = () => {
    throw new Error("Not yet implemented");
  };

  private getYearlyData = () => {
    throw new Error("Not yet implemented");
  };

  /**
   * Generate filepaths w/ prefixes + times for prices and usage files
   * @param {Time} time - the requested by the client time of data - year, month, day
   * @param {boolean} isForPrice - prices have a trailing zero, usages do not
   * @returns an object w/ fullpaths of prices and usage
   */
  private getProperTimePadding = (
    time: Time,
    isForPrice: boolean = true
  ): Time => {
    // if given time is one digit
    // can be also written as time.toString().length === 1
    if (+time <= 9) {
      return isForPrice
        ? time?.toString().padStart(2, "0") // times for price files have a trailing zero
        : Number(time).toString(); // times for usage files do not have a trailing zero
    }

    return time;
  };
}

export default CloudStorageClient;
