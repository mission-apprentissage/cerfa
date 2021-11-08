const config = require("config");
const util = require("util");
const { throttle } = require("lodash");
const bunyan = require("bunyan");
const PrettyStream = require("bunyan-prettystream");
const BunyanSlack = require("bunyan-slack");
const BunyanMongodbStream = require("bunyan-mongodb-stream");
const { Log } = require("./model/index");

function jsonStream(level) {
  return {
    name: "json",
    level,
    stream: process.stdout,
  };
}

function consoleStream(level, output) {
  const pretty = new PrettyStream();
  pretty.pipe(output);
  return {
    name: "console",
    level,
    stream: pretty,
  };
}

function mongoDBStream() {
  return {
    name: "mongodb",
    level: "info",
    stream: BunyanMongodbStream({ model: Log }),
  };
}

function slackStream(envName) {
  const stream = new BunyanSlack(
    {
      webhook_url: config.slackWebhookUrl,
      customFormatter: (record, levelName) => {
        if (record.type === "http") {
          record = {
            url: record.request.url.relative,
            statusCode: record.response.statusCode,
            ...(record.error ? { message: record.error.message } : {}),
          };
        }
        return {
          text: util.format(`[%s][${envName}] %O`, levelName.toUpperCase(), record),
        };
      },
    },
    (error) => {
      console.error("Unable to send log to slack", error);
    }
  );

  stream.write = throttle(stream.write, 5000);

  return {
    name: "slack",
    level: "error",
    stream,
  };
}

const createStreams = () => {
  const { destinations, level } = config.log;
  const envName = config.env;

  let availableDestinations = {
    json: () => jsonStream(level),
    stdout: () => consoleStream(level, process.stdout),
    stderr: () => consoleStream(level, process.stderr),
    mongodb: () => mongoDBStream(),
    slack: () => slackStream(envName),
  };

  return destinations.split(",").map((type) => availableDestinations[type]());
};

module.exports = bunyan.createLogger({
  name: config.appName,
  serializers: bunyan.stdSerializers,
  streams: createStreams(),
});
