const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// Create a client to access the Secret Manager service
const client = new SecretManagerServiceClient();

// Define the name of the secret
const name =
  "projects/toki-challenge-382218/secrets/toki-service-account/versions/latest";

// Retrieve the secret
const getServiceAccount = async () => {
  const [version] = await client.accessSecretVersion({ name });
  const payload = version.payload.data.toString();

  return payload;
};

export default getServiceAccount;
