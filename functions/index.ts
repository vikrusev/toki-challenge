const { Storage: Storage2 } = require("@google-cloud/storage");

const helloData = async (req: any, res: any) => {
  // Instantiate a new client using the service account key file
  const storage = new Storage2({
    keyFilename: "/secrets/toki-service-account",
  });

  // Use the client to access Google Cloud Storage
  const bucketName = "toki-take-home.appspot.com";
  const [files] = await storage.bucket(bucketName).getFiles();
  console.log(`Retrieved all files in ${bucketName}:`);

  res.send(
    `Available files: \r\n ${files.map((f: any) => f.name).join("\r\n")}`
  );
};

export { helloData };
