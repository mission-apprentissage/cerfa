const AWS = require("aws-sdk");
// const config = require("../../config");

const s3 = new AWS.S3();

// const s3 = new AWS.S3({
//   apiVersion: "2006-03-01",
//   region: "eu-west-3",
//   credentials: {
//     accessKeyId: config.aws.AccessKeyId,
//     secretAccessKey: config.aws.SecretAccessKey,
//   },
// });

const BUCKET_NAME = "BUCKET";

module.exports = {
  getS3ObjectAsStream: (key) => {
    return s3.getObject({ Bucket: BUCKET_NAME, Key: key }).createReadStream();
  },
  putS3ObjectAsStream: (fileStream, key) => {
    return s3.putObject({
      Bucket: BUCKET_NAME,
      Key: key,
      ACL: "public-read", // TODO Make it not Public read
      Body: fileStream,
      Metadata: { type: "pdf" },
    });
  },
};
