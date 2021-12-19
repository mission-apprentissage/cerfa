const corsRules = require("../../common/corsRules");

module.exports = () => {
  // eslint-disable-next-line no-unused-vars
  return (req, res, next) => {
    res.header("Access-Control-Allow-Origin", corsRules.origin);
    res.header("Access-Control-Allow-Headers", corsRules.allowedHeaders.join(", "));
    next();
  };
};
