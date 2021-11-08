const { runScript } = require("../scriptWrapper");
const clearData = require("./clear");

runScript(async () => {
  await clearData();
});
