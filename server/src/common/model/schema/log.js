// @ts-check

/** @typedef {import("./log").LogSchema} Log */

const logSchema = {
  msg: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    expires: "7d", // mongo will auto-remove data after 7 days
    required: true,
  },
};
module.exports = logSchema;
