import CloudStorageClient from "./CloudStorageClient";
import isUserInputValid from "./business/userInput.validator";
import getStorageOptions from "./getStorageOptions";

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
  // check if user input is valid
  if (!isUserInputValid(req.query)) {
    throw new Error("User Input is invalid");
  }

  // read options for Cloud Storage
  const storageOptions = await getStorageOptions(Boolean(process.env.CI_PROD));

  // build a CloudStorageClient to work w/ requested data
  const cloudStorageClient = new CloudStorageClient(storageOptions);

  // get user requested data
  const responseData = await cloudStorageClient.getUserData(req.query);

  // send response back to client
  res.send(`${responseData}`);
};

export { helloData };
