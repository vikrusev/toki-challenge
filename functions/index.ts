import CloudStorageClient from "./CloudStorageClient";
import { BUCKET_NAME } from "./constants/constants";

import userInputValidator from "./business/userInput.validator";
import getServiceAccountBucket from "./getServiceAccountBucket";

/**
 * Retrieve data from usage/ and prices/ objects from TOKI's
 * Google Cloud Storage Bucket
 *
 * Client may provide
 *  - only YEAR
 *    - returns all 12 months of the YEAR w/ mean values of electricity price and metering point(s) usage
 *      - the mean for each month is calculated first based on hours, then on days
 *  - YEAR and MONTH
 *    - returns all days of the MONTH in YEAR w/ mean values of electricity price and metering point(s) usage
 *      - the mean for each day is calculated based on hours
 *  - YEAR, MONTH and DAY
 *    - returns all hours of a DAY in a MONTH in YEAR w/ actual values of the electricity price and metering point(s) usage
 * Providing METERING_POINT_ID is optional for all variants from above
 */
const helloData = async (req: any, res: any) => {
  if (!userInputValidator(req.query)) {
    throw new Error("User Input is invalid");
  }

  // TODO move initilization to CloudStorageClient
  // instantiate a new client based on the CI_PROD env variable
  const storageBucket = await getServiceAccountBucket(
    BUCKET_NAME,
    Boolean(process.env.CI_PROD)
  );

  // prepare a CloudStorageClient entity to work w/ requested data
  const cloudStorage = new CloudStorageClient(storageBucket);

  // get user requested data
  const responseData = await cloudStorage.getUserData(req.query);

  // send response back to client
  res.send(`${responseData}`);
};

export { helloData };
