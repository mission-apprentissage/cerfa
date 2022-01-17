const { JwtSession } = require("../model/index");

module.exports = async () => {
  return {
    addJwt: async (jwt) => {
      await JwtSession.create({ jwt });
    },
    findJwt: async (jwt) => {
      return await JwtSession.exists({ jwt });
    },
    removeJwt: async (jwt) => {
      await JwtSession.deleteOne({ jwt });
    },
  };
};
