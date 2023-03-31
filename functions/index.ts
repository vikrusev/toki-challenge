import getServiceAccountStorage from "./getServiceAccountStorage";

const helloData = async (req: any, res: any) => {
  // instantiate a new client based on the CI_PROD env variable
  const storage = await getServiceAccountStorage(Boolean(process.env.CI_PROD));

  // use the client to access Google Cloud Storage
  const bucketName = "toki-take-home.appspot.com";
  const [files] = await storage.bucket(bucketName).getFiles();
  console.log(`Retrieved all files in ${bucketName}:`);

  res.send(
    `Available files: \r\n ${files.map((f: any) => f.name).join("\r\n")}`
  );
};

export { helloData };
