const AWS = require("aws-sdk");
const config = require("../../config");

const s3 = new AWS.S3({
  accessKeyId: config.objectStorage.aws.AccessKeyId,
  secretAccessKey: config.objectStorage.aws.SecretAccessKey,
  endpoint: config.objectStorage.aws.BasePath,
  region: config.objectStorage.aws.region,
  s3ForcePathStyle: config.objectStorage.aws.s3ForcePathStyle,
  signatureVersion: config.objectStorage.aws.signatureVersion,
});

module.exports = {
  getS3ObjectAsStream: (key) => {
    return s3.getObject({ Bucket: config.objectStorage.aws.Bucket, Key: key }).createReadStream();
  },
  putS3Object: (fileBinary, key) => {
    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          Bucket: config.objectStorage.aws.Bucket,
          Key: key,
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
  deleteS3Object: (key) => {
    return new Promise((resolve, reject) => {
      s3.deleteObject(
        {
          Bucket: config.objectStorage.aws.Bucket,
          Key: key,
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data);
        }
      );
    });
  },
};
