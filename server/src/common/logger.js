const config = require("../config");
const util = require("util");
const bunyan = require("bunyan");
const PrettyStream = require("bunyan-prettystream");
const BunyanSlack = require("bunyan-slack");
const BunyanMongodbStream = require("bunyan-mongodb-stream");
const { Log } = require("./model/index");
const { throttle } = require("lodash");

const createStreams = () => {
  const { level, destinations } = config.log;
  const envName = config.env;
  const availableDestinations = {
    stdout: () => consoleStream("stdout"),
    stderr: () => consoleStream("stderr"),
    mongodb: () => mongoDBStream(),
    slack: () => slackStream(),
  };

  const consoleStream = (outputName) => {
    const pretty = new PrettyStream();
    pretty.pipe(process[outputName]);
    return {
      name: "console",
      level,
      stream: pretty,
    };
  };

  const mongoDBStream = () => {
    return {
      name: "mongodb",
      level,
      stream: BunyanMongodbStream({ model: Log }),
    };
  };

  const slackStream = () => {
    const stream = new BunyanSlack(
      {
        webhook_url: config.slackWebhookUrl,
        customFormatter: (record, levelName) => {
          if (record.type === "http") {
            record = {
              url: record.request.url.relative,
              statusCode: record.response.statusCode,
              ...(record.error
                ? {
                    message: record.error.message,
                    data: record.error.data,
                    reason: record.error.data.reason,
                    str: JSON.stringify(record.error.data.reason),
                  }
                : {}),
            };
          }
          return {
            text: util.format(`[%s][${envName}] %O`, levelName.toUpperCase(), record),
          };
        },
      },
      (error) => {
        console.log("Unable to send log to slack", error);
      }
    );

    stream.write = throttle(stream.write, 5000);

    return {
      name: "slack",
      level: "error",
      stream,
    };
  };

  return destinations.split(",").map((type) => availableDestinations[type]());
};

module.exports = bunyan.createLogger({
  name: config.appName,
  serializers: bunyan.stdSerializers,
  streams: createStreams(),
});
