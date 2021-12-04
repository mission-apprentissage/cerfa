const express = require("express");
const Joi = require("joi");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const { getDataFromSiret } = require("../../../logic/handlers/siretHandler");

module.exports = () => {
  const router = express.Router();

  router.post(
    "/",
    tryCatch(async ({ body }, res) => {
      const { siret } = await Joi.object({
        siret: Joi.string().required(),
      }).validateAsync(body, { abortEarly: false });

      // TODO HAS RIGHTS

      const data = await getDataFromSiret(siret);

      let uai = ""; // TODO  FOR TEST
      if (siret === "30291412200015") {
        uai = "0561910X";
      }
      let dataResult = data.result;
      if (Object.keys(dataResult).length > 0) {
        dataResult = { ...data.result, uai };
      }
      return res.json({ ...data, result: dataResult });
    })
  );

  return router;
};