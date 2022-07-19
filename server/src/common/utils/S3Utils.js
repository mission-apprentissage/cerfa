const AWS = require("aws-sdk");
const config = require("../../config");

const s3 = new AWS.S3({
  accessKeyId: config.aws.AccessKeyId,
  secretAccessKey: config.aws.SecretAccessKey,
  endpoint: config.aws.BasePath,
  region: config.aws.region,
  s3ForcePathStyle: config.aws.s3ForcePathStyle,
  signatureVersion: config.aws.signatureVersion,
});

module.exports = {
  getS3ObjectAsStream: (key) => {
    return s3.getObject({ Bucket: config.aws.Bucket, Key: key }).createReadStream();
  },
  putS3Object: (fileBinary, key) => {
    console.log(JSON.stringify(config.aws));

    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          Bucket: config.aws.Bucket,
          Key: key,
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
  deleteS3Object: (key) => {
    return new Promise((resolve, reject) => {
      s3.deleteObject(
        {
          Bucket: config.aws.Bucket,
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
