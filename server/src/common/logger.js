const util = require("util");
const { throttle, omit, isEmpty } = require("lodash");
const bunyan = require("bunyan");
const BunyanSlack = require("bunyan-slack");
const BunyanTeams = require("bunyan-teams");
const BunyanMongodbStream = require("bunyan-mongodb-stream");
const { Log } = require("./model/index");
const config = require("../config");
const chalk = require("chalk");
const { compose, writeData, transformData } = require("oleoduc");

function prettyPrintStream(outputName) {
  let levels = {
    10: chalk.grey.bold("TRACE"),
    20: chalk.green.bold("DEBUG"),
    30: chalk.blue.bold("INFO"),
    40: chalk.yellow.bold("WARN"),
    50: chalk.red.bold("ERROR"),
    60: chalk.magenta.bold("FATAL"),
  };

  return compose(
    transformData((raw) => {
      let stack = raw.err?.stack;
      let message = stack ? `${raw.msg}\n${stack}` : raw.msg;
      let rest = omit(raw, [
        //Bunyan core fields https://github.com/trentm/node-bunyan#core-fields
        "v",
        "level",
        "name",
        "hostname",
        "pid",
        "time",
        "msg",
        "src",
        //Error fields already serialized with https://github.com/trentm/node-bunyan#standard-serializers
        "err.name",
        "err.stack",
        "err.message",
        "err.code",
        "err.signal",
        //Misc
        "context",
      ]);

      let params = [
        util.format("[%s][%s][%s] %s", raw.time.toISOString()),
        levels[raw.level],
        raw.context || "global",
        message,
      ];
      if (!isEmpty(rest)) {
        params.push(chalk.gray(`\n${util.inspect(rest, { depth: null })}`));
      }
      return params;
    }),
    writeData((data) => console[outputName === "stdout" ? "log" : "error"](...data))
  );
}

function sendLogsToConsole(outputName) {
  const { level, format } = config.log;
  return format === "pretty"
    ? {
        type: "raw",
        name: outputName,
        level,
        stream: prettyPrintStream(outputName),
      }
    : {
        name: outputName,
        level,
        stream: process[outputName],
      };
}

function mongoDBStream() {
  const { level } = config.log;
  return {
    name: "mongodb",
    level,
    stream: BunyanMongodbStream({ model: Log }),
  };
}

function stringify(val, depth, replacer, space) {
  depth = isNaN(+depth) ? 1 : depth;
  function _build(key, val, depth, o, a) {
    // (JSON.stringify() has it's own rules, which we respect here by using it for property iteration)
    return !val || typeof val != "object"
      ? val
      : ((a = Array.isArray(val)),
        JSON.stringify(val, function (k, v) {
          if (a || depth > 0) {
            if (replacer) v = replacer(k, v);
            if (!k) return (a = Array.isArray(v)), (val = v);
            !o && (o = a ? [] : {});
            o[k] = _build(k, v, a ? depth : depth - 1);
          }
        }),
        o || (a ? [] : {}));
  }
  return JSON.stringify(_build("", val, depth), null, space);
}

function sendLogsToSlack() {
  const stream = new BunyanSlack(
    {
      webhook_url: config.slackWebhookUrl,
      customFormatter: (record, levelName) => {
        if (record.type === "http") {
          let data = record.error.data;
          if (data.reason === "") delete data.reason;
          record = {
            url: record.request.url.relative,
            statusCode: record.response.statusCode,
            ...(record.error
              ? {
                  message: record.error.message,
                  data: {
                    ...(data.reason
                      ? {
                          message: data.message,
                          error: stringify(data.reason, 4, null, 0),
                        }
                      : { error: stringify(data, 4, null, 0) }),
                  },
                }
              : {}),
          };
        }
        return {
          text: util.format(`[%s][${config.env}] %O`, levelName.toUpperCase(), record),
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

function sendLogsToTeams() {
  console.error("config teams: " + config.teamsWebhookUrl);
  const stream = new BunyanTeams({
    webhook_url: config.teamsWebhookUrl,
  });

  stream.write = throttle(stream.write, 5000);

  return {
    name: "teams",
    level: "error",
    stream,
  };
}

const createStreams = () => {
  let availableDestinations = {
    stdout: () => sendLogsToConsole("stdout"),
    stderr: () => sendLogsToConsole("stderr"),
    mongodb: () => mongoDBStream(),
    slack: () => sendLogsToSlack(),
    teams: () => sendLogsToTeams(),
  };

  return config.log.destinations
    .filter((type) => availableDestinations[type])
    .map((type) => {
      let createDestination = availableDestinations[type];
      return createDestination();
    });
};

module.exports = bunyan.createLogger({
  name: config.appName,
  serializers: {
    ...bunyan.stdSerializers,
    err: function (err) {
      return {
        ...bunyan.stdSerializers.err(err),
        ...(err.errInfo ? { errInfo: err.errInfo } : {}),
      };
    },
  },
  streams: createStreams(),
});
