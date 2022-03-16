const { runScript } = require("../scriptWrapper");
const logger = require("../../common/logger");

const emailsToLowerCase = require("./emailsLowercase");

const patchesList = [
  {
    patch: "Email to lower case",
    date: "16/03/2020",
    descr: "transforme tous les emails en base en minuscule",
    arg: "--emailLowercase",
  },
];

runScript(async () => {
  const args = process.argv.slice(2);
  logger.info(`Patch`);

  const listArg = args.includes("--list");
  const emailLowercaseArg = args.includes("--emailLowercase");

  if (emailLowercaseArg) {
    await emailsToLowerCase();
  } else if (listArg) {
    console.table(patchesList);
  } else {
    console.table(patchesList);
  }
});
