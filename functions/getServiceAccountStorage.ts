import { Storage } from "@google-cloud/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

/**
 * Initialize connection to Secret Manager
 * And retrieve configuration data for TOKI's Service Account
 * @returns the secret payload
 */
const getConfigurationFromSecretManager = async () => {
  // create a client to access the Secret Manager service
  const client = new SecretManagerServiceClient();

  // define the name of the secret
  const secretName = "toki-service-account";
  const secretFullPath = `projects/toki-challenge-382218/secrets/${secretName}/versions/latest`;

  const [version] = await client.accessSecretVersion({ name: secretFullPath });
  const payload = version?.payload?.data?.toString();

  if (!payload) {
    console.error(
      `Payload for secret ${secretFullPath} does not exist or is empty`
    );
    throw new Error("Secret Payload Empty");
  }

  return JSON.parse(payload);
};

/**
 * Retrieve TOKI's service account configuration filepath from Secret Manager
 * This result is based on on the CI_PROD environment variable
 *  - if truthy - the filepath /secrets will be mounted to the function
 *  - if falsy - we should get the config file from Secret Manager
 *
 * @param {boolean} isProduction - taken form the CI_PROD env variable
 * @returns {string} - path to the configuration file
 */
const getServiceAccountStorage = async (
  isProduction: boolean
): Promise<Storage> => {
  // production run will have the config file mounted in /secrets
  if (isProduction) {
    return new Storage({ keyFilename: "/secrets/toki-service-account" });
  }

  // otherwise, get the configuration from the Secret Manager
  const credentials = await getConfigurationFromSecretManager();
  return new Storage({ credentials });
};

export default getServiceAccountStorage;
