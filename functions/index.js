// const HttpFunction = require("@google-cloud/functions-framework");
const { Storage } = require("@google-cloud/storage");

/**
 * Retrieve all data from TOKI's GC Datalake
 */
exports.helloData = async (req, res) => {
  // TODO take the data from GC Secret Manager
  // Instantiate a new client using the service account key file
  const storage = new Storage({
    keyFilename: "./functions/toki-take-home-774e713e21c1.json",
  });

  // Use the client to access Google Cloud Storage
  const bucketName = "toki-take-home.appspot.com";
  const [files] = await storage.bucket(bucketName).getFiles();
  console.log(`Retrieved all files in ${bucketName}:`);

  res.send(`Available files: \r\n ${files.map((f) => f.name).join("\r\n")}`);
};

// TODO uncomment when file extension is changed to .ts
// if this file is not treated as an "external" module
// the Storage import complains about redeclaring the variable from DOM
// export { helloData };
