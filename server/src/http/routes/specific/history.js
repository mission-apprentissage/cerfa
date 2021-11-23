const express = require("express");
const Joi = require("joi");
const { History } = require("../../../common/model/index");
const tryCatch = require("../../middlewares/tryCatchMiddleware");

module.exports = () => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    let { query } = await Joi.object({
      query: Joi.string().default("{}"),
    }).validateAsync(req.query, { abortEarly: false });

    let json = JSON.parse(query);
    const result = await History.find(json);

    return res.json(result);
  });

  router.post(
    "/",
    tryCatch(async ({ body }, res) => {
      let { dossierId, context, history } = await Joi.object({
        dossierId: Joi.string().required(),
        context: Joi.string().required(),
        history: Joi.array()
          .items({
            from: Joi.string().default(""),
            to: Joi.string().required(),
            how: Joi.string().required(),
            who: Joi.string().required(),
            when: Joi.date().default(Date.now),
          })
          .default([]),
      }).validateAsync(body, { abortEarly: false });

      const result = await History.create({
        dossierId,
        context,
        history,
      });

      return res.json(result);
    })
  );

  router.put(
    "/:id",
    tryCatch(async ({ body, params }, res) => {
      await Joi.object({
        from: Joi.string().allow("").required(),
        to: Joi.string().required(),
        how: Joi.string().required(),
        who: Joi.string().required(),
        when: Joi.date().default(Date.now),
      }).validateAsync(body, { abortEarly: false });

      const result = await History.findOneAndUpdate(
        { _id: params.id },
        {
          $push: { history: body },
        },
        {
          new: true,
        }
      );

      return res.json(result);
    })
  );

  router.put(
    "/",
    tryCatch(async ({ body }, res) => {
      await Joi.object({
        dossierId: Joi.string().required(),
        context: Joi.string().required(),
        from: Joi.string().allow("").required(),
        to: Joi.string().required(),
        how: Joi.string().required(),
        who: Joi.string().required(),
        when: Joi.date().default(Date.now),
      }).validateAsync(body, { abortEarly: false });

      const { dossierId, context, ...rest } = body;
      const result = await History.findOneAndUpdate(
        { dossierId, context },
        {
          $push: { history: rest },
        },
        {
          new: true,
        }
      );

      return res.json(result);
    })
  );

  router.delete(
    "/:id",
    tryCatch(async ({ params }, res) => {
      const result = await History.deleteOne({ _id: params.id });
      return res.json(result);
    })
  );

  return router;
};
