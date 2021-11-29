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

      const data = await getDataFromSiret(siret);

      return res.json(data);
    })
  );

  return router;
};
