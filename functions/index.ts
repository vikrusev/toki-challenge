import getServiceAccountBucket from "./getServiceAccountBucket";

const BUCKET_NAME = "toki-take-home.appspot.com";

const helloData = async (req: any, res: any) => {
  // instantiate a new client based on the CI_PROD env variable
  const storageBucket = await getServiceAccountBucket(
    BUCKET_NAME,
    Boolean(process.env.CI_PROD)
  );

  // example of downloading contents of a file
  const [files] = await storageBucket.getFiles();

  const contents = await storageBucket.file(files[160].name).download();

  res.send(`Contents in file ${contents}:`);
};

export { helloData };
