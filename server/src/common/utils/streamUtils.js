const { isEmpty: _isEmpty } = require("lodash");
const util = require("util");
const { Transform, Writable } = require("stream");
const pipeline = util.promisify(require("stream").pipeline);
const { encodeStream, decodeStream } = require("iconv-lite");
const mergeStreams = require("multipipe");

let transformObject = (transform, options = {}) => {
  let lines = 0;
  let isFirstLine = () => (options.ignoreFirstLine || false) && lines++ === 0;
  let isEmpty = (value) => (options.ignoreEmpty || false) && _isEmpty(value);
  let parallel = options.parallel || 1;

  let promises = [];

  return new Transform({
    objectMode: true,
    transform: async function (chunk, encoding, callback) {
      if (promises.length >= parallel) {
        await Promise.all(promises);
        promises = [];
      }

      if (isEmpty(chunk) || isFirstLine()) {
        return callback();
      }

      try {
        let value = transform(chunk);
        promises.push(
          Promise.resolve(value)
            .then((res) => {
              if (!isEmpty(res)) {
                this.push(res);
              }
              callback();
            })
            .catch((e) => callback(e))
        );
      } catch (e) {
        callback(e);
      }
    },
    async flush(done) {
      await Promise.all(promises);
      done();
    },
  });
};

let writeObject = (write, options = {}) => {
  let parallel = options.parallel || 1;

  let promises = [];

  return new Writable({
    objectMode: true,
    write: async (data, enc, done) => {
      if (promises.length >= parallel) {
        await Promise.all(promises);
        promises = [];
      }

      try {
        let value = write(data);
        promises.push(
          Promise.resolve(value)
            .then(() => done())
            .catch((e) => done(e))
        );
      } catch (e) {
        return done(e);
      }
    },
    end: async (done) => {
      await Promise.all(promises);
      done();
    },
  });
};
module.exports = {
  pipeline,
  encodeStream,
  decodeStream,
  transformObject,
  writeObject,
  mergeStreams,
  ignoreEmpty: () => transformObject((data) => data, { ignoreEmpty: true }),
  ignoreFirstLine: () => transformObject((data) => data, { ignoreFirstLine: true }),
  accumulate: (acc) => writeObject((data) => acc.push(data)),
};
