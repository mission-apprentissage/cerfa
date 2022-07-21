const config = require("../../config");
const axios = require("axios");
const util = require("util");

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

class BunyanTeams {
  constructor(options, error) {
    options = options || {};

    if (!options.webhook_url) {
      throw new Error("BunyanTeams: webhook_url needed!");
    } else {
      this.webhook_url = options.webhook_url || options.webhookUrl;
      this.customFormatter = options.customFormatter;
      this.error = error || function () {};
    }
  }

  write(record) {
    if (typeof record === "string") {
      record = JSON.parse(record);
    }

    const level = levels[record.level];
    const timestamp = new Date(record.time);

    const message = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      themeColor: "0072C6",
      summary: "Summary description",
      sections: [
        {
          activityTitle: record.error.message ?? level,
          text: "Teams logger",
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
    };

    let data;
    try {
      data = this.customFormatter
        ? this.customFormatter(record, level)
        : {
            text: util.format("[%s] %s", level.toUpperCase(), record.error.stack ?? record.msg),
          };
    } catch (err) {
      return this.error(err);
    }

    message.sections[0].text = `\`\`\`\n${data.text}\n\`\`\``;

    axios
      .post(this.webhook_url, message, {
        headers: { "Content-Type": "application/json" },
      })
      .catch((err) => {
        console.error("erreur lors de l'envoi a teams");
        return this.error(err);
      });
  }
}

module.exports = BunyanTeams;
