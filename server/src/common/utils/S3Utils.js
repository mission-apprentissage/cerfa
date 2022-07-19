const AWS = require("aws-sdk");
const config = require("../../config");

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  region: "eu-west-3",
  credentials: {
    accessKeyId: config.aws.AccessKeyId,
    secretAccessKey: config.aws.SecretAccessKey,
  },
});

module.exports = {
  getS3ObjectAsStream: (key) => {
    return s3.getObject({ Bucket: config.aws.Bucket, Key: key }).createReadStream();
  },
  putS3Object: (fileBinary, key) => {
    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          Bucket: config.aws.Bucket,
          Key: `${config.aws.BasePath}/${key}`,
          // ACL: "public-read", // TODO Make it not Public read
          Body: fileBinary,
          Metadata: { type: "pdf" },
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  },
};
