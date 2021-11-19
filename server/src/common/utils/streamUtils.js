const { isEmpty: _isEmpty } = require("lodash");
const { Transform } = require("stream");
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

module.exports = {
  transformObject,
  mergeStreams,
};
