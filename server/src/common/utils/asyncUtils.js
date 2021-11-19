const { chunk } = require("lodash");

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const chunkedAsyncForEach = async (array, callback, chunkSize = 10) => {
  const chunks = chunk(array, chunkSize);
  await asyncForEach(chunks, async (chunk) => {
    await Promise.all(
      chunk.map(async (item) => {
        await callback(item);
      })
    );
  });
};

module.exports = { asyncForEach, chunkedAsyncForEach };
