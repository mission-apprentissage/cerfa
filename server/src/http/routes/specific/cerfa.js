const express = require("express");
const Joi = require("joi");
const Boom = require("boom");
const { Cerfa } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");
const cerfaSchema = require("../../../common/model/schema/specific/cerfa/Cerfa");

module.exports = () => {
  const router = express.Router();

  router.get("/schema", async (req, res) => {
    return res.json(cerfaSchema);
  });

  router.get("/", async (req, res) => {
    let { query } = await Joi.object({
      query: Joi.string().default("{}"),
    }).validateAsync(req.query, { abortEarly: false });

    let json = JSON.parse(query);
    const result = await Cerfa.find(json);

    return res.json(result);
  });

  router.get(
    "/:id",
    tryCatch(async ({ params }, res) => {
      const cerfa = await Cerfa.findById(params.id);
      if (!cerfa) {
        throw Boom.notFound("Doesn't exist");
      }
      res.json(cerfa);
    })
  );

  // router.post(
  //   "/",
  //   tryCatch(async ({ body }, res) => {
  //     let { dossierId, context, history } = await Joi.object({
  //       dossierId: Joi.string().required(),
  //       context: Joi.string().required(),
  //       history: Joi.array()
  //         .items({
  //           from: Joi.string().default(""),
  //           to: Joi.string().required(),
  //           how: Joi.string().required(),
  //           who: Joi.string().required(),
  //           when: Joi.date().default(Date.now),
  //         })
  //         .default([]),
  //     }).validateAsync(body, { abortEarly: false });

  //     const result = await Cerfa.create({
  //       dossierId,
  //       context,
  //       history,
  //     });

  //     return res.json(result);
  //   })
  // );

  return router;
};
