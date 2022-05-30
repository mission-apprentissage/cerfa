const config = require("../../config");
const util = require("util");
const fetch = require("node-fetch");

const levels = {
  10: "trace",
  20: "debug",
  30: "info",
  40: "warn",
  50: "error",
  60: "fatal",
};

const colors = {
  10: "BBBBBB", // trace
  20: "BBBBBB", // debug
  30: "000000", // info
  40: "FF9800", // warn
  50: "E51C23", // error
  60: "E51C23", // fatal
};

function BunyanTeams(options, error) {
  options = options || {};

  if (!options.webhook_url) {
    throw new Error("BunyanTeams: webhook_url needed!");
  } else {
    this.webhook_url = options.webhook_url || options.webhookUrl;
    this.customFormatter = options.customFormatter;
    this.error = error || function () {};
  }
}

BunyanTeams.prototype.write = function write(record) {
  let self = this;
  let data;

  if (typeof record === "string") {
    record = JSON.parse(record);
  }

  const level = levels[record.level];
  const timestamp = new Date(record.time);

  const message = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: colors[record.level],
    markdown: true,
    sections: [
      {
        facts: [
          {
            name: "Environnement",
            value: config.env,
          },
          {
            name: "Level",
            value: level.toUpperCase(),
          },
          {
            name: "At",
            value: timestamp.toISOString(),
          },
        ],
      },
    ],
    title: util.format(`[%s][${config.env}]`, level.toUpperCase()),
  };

  try {
    data = self.customFormatter
      ? self.customFormatter(record, level)
      : {
          text: util.format("[%s] %s", level.toUpperCase(), record.msg),
        };
  } catch (err) {
    return self.error(err);
  }

  // just trim the message for now until 1K chars
  message.text = `\`\`\`\n${JSON.stringify(data)}\n\`\`\``;

  fetch(self.webhook_url, {
    method: "post",
    body: JSON.stringify(message),
    headers: { "Content-Type": "application/json" },
  }).catch((err) => {
    return self.error(err);
  });
};

module.exports = BunyanTeams;
