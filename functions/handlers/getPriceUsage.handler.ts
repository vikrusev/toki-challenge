import CloudStorageClient from "../business/CloudStorageClient";
import getStorageOptions from "../config/getStorageOptions";
import validationSchema from "../business/validators/userInput.validator";
import evaluateInformation from "../business/evaluateInformation";
import { BadRequestException } from "../utils/exceptions";

/**
 * Retrieve data from usage and prices objects from TOKI's Google Cloud Storage Bucket
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
 *
 * Providing METERING_POINT_ID is optional for all variants from above
 */
const getPriceUsageData = async ({ query: queryParams }: any) => {
    // check if user input is valid
    const userInputValidationResult = validationSchema.validate(queryParams);
    if (userInputValidationResult.error) {
        throw new BadRequestException(
            `User Input is invalid. Error: ${userInputValidationResult.error}`
        );
    }

    // read options for Cloud Storage
    const storageOptions = await getStorageOptions(
        Boolean(process.env.CI_PROD)
    );

    // build a CloudStorageClient to work w/ requested data
    const cloudStorageClient = new CloudStorageClient(storageOptions);

    // get user requested data
    const requestedData = await cloudStorageClient.getUserData(queryParams);

    // evaluate requested data
    const clientData = evaluateInformation(requestedData, queryParams);

    // send final information to client
    return clientData;
};

export default getPriceUsageData;
