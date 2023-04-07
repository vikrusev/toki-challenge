import { StorageOptions } from "@google-cloud/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

import { SECRET_NAME, SECRET_KEYFILENAME_PATH_PROD } from "./constants";
import { ServiceUnavailable } from "../utils/exceptions";

/**
 * Retrieve TOKI's Google Storage Options
 * The result is based on on the CI_PROD environment variable
 *  - if truthy - the filepath /secrets will be mounted to the function by Google
 *  - if falsy - we should get the config file from Secret Manager
 *
 * @param {boolean} isProduction - taken from the CI_PROD env variable
 */
const getStorageOptions = async (
    isProduction: boolean
): Promise<StorageOptions> => {
    // production run will have the config file mounted in /secrets
    if (isProduction) {
        return {
            keyFilename: `${SECRET_KEYFILENAME_PATH_PROD}/${SECRET_NAME}`,
        };
    }

    // otherwise, get the configuration from the Secret Manager
    return await getConfigurationFromSecretManager();
};

/**
 * Initialize connection to Secret Manager
 * And retrieve configuration data for TOKI's Service Account
 * @returns the secret payload in a credentials property, because i cannot use the type CredentialBody
 * @throws error if the secret payload is empty or does not exist
 */
const getConfigurationFromSecretManager = async (): Promise<StorageOptions> => {
    // create a client to access the Secret Manager service
    const client = new SecretManagerServiceClient({
        keyFilename: "toki-challenge-service-account.json",
    });

    // define the name of the secret
    const secretFullPath = `projects/toki-challenge-382218/secrets/${SECRET_NAME}/versions/latest`;

    // get secret version data
    const [version] = await client.accessSecretVersion({
        name: secretFullPath,
    });
    const payload = version?.payload?.data?.toString();

    if (!payload) {
        throw new ServiceUnavailable(
            "Something is not available on our side",
            `Payload of secret ${secretFullPath} does not exist or is empty`
        );
    }

    return { credentials: JSON.parse(payload) };
};

export default getStorageOptions;
