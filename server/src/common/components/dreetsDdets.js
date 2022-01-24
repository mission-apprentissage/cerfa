const { DdetsDreets } = require("../model/index");

module.exports = async () => {
  return {
    findDreets: async (code_region, select = {}) =>
      await DdetsDreets.findOne({ code_region, type: "DREETS" }, select).lean(),
    findDdets: async (code_dpt, select = {}) => await DdetsDreets.findOne({ code_dpt, type: "DDETS" }, select).lean(),
  };
};
