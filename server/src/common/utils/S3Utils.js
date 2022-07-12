const AWS = require("aws-sdk");

const s3 = new AWS.S3();

const BUCKET_NAME = "BUCKET";

module.exports = {
  getS3ObjectAsStream: (key) => {
    return s3.getObject({ Bucket: BUCKET_NAME, Key: key }).createReadStream();
  },
};
