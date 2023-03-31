import { Storage, Bucket, StorageOptions } from "@google-cloud/storage";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

/**
 * Initialize connection to Secret Manager
 * And retrieve configuration data for TOKI's Service Account
 * @returns the secret payload in a credentials property, because i cannot use the type CredentialBody
 * @throws error if the secret payload is empty or does not exist
 */
const getConfigurationFromSecretManager = async (): Promise<StorageOptions> => {
  // create a client to access the Secret Manager service
  const client = new SecretManagerServiceClient();

  // define the name of the secret
  const secretName = "toki-service-account";
  const secretFullPath = `projects/toki-challenge-382218/secrets/${secretName}/versions/latest`;

  // get secret version data
  const [version] = await client.accessSecretVersion({ name: secretFullPath });
  const payload = version?.payload?.data?.toString();

  if (!payload) {
    console.error(
      `Payload for secret ${secretFullPath} does not exist or is empty`
    );
    throw new Error("Secret Payload Empty");
  }

  return { credentials: JSON.parse(payload) };
};

/**
 * Constructs a Storage client and returns a reference to TOKI's Google Cloud Storage Bucket
 * @param {string} bucketName - name of bucket
 * @param {StorageOptions} options
 * @returns a reference to a bucket
 */
const getStorageBucket = (
  bucketName: string,
  options: StorageOptions
): Bucket => {
  return new Storage(options).bucket(bucketName);
};

/**
 * Retrieve TOKI's Google Storage Datalake Bucket
 * This result is based on on the CI_PROD environment variable
 *  - if truthy - the filepath /secrets will be mounted to the function
 *  - if falsy - we should get the config file from Secret Manager
 *
 * @param {string} bucketName - the name of TOKI's Bucket
 * @param {boolean} isProduction - taken form the CI_PROD env variable
 * @returns {string} - path to the configuration file
 */
const getServiceAccountBucket = async (
  bucketName: string,
  isProduction: boolean
): Promise<Bucket> => {
  // production run will have the config file mounted in /secrets
  if (isProduction) {
    return getStorageBucket(bucketName, {
      keyFilename: "/secrets/toki-service-account",
    });
  }

  // otherwise, get the configuration from the Secret Manager
  const storageOptions = await getConfigurationFromSecretManager();
  return getStorageBucket(bucketName, storageOptions);
};

export default getServiceAccountBucket;
