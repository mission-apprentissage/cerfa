const express = require("express");
const { MaintenanceMessage } = require("../../common/model/index");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = () => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const result = await MaintenanceMessage.find({});
    return res.json(result);
  });

  router.post(
    "/",
    tryCatch(async ({ body }, res) => {
      const { msg, name, type, enabled, context } = body;

      if (!msg || !name || !type || enabled === undefined) {
        return res.status(400).send({ error: "Erreur avec le message ou avec le nom ou le type ou enabled" });
      }

      const newMaintenanceMessage = new MaintenanceMessage({
        type,
        context,
        name,
        msg,
        enabled,
        time: new Date(),
      });

      await newMaintenanceMessage.save();

      return res.json(newMaintenanceMessage);
    })
  );

  router.put(
    "/:id",
    tryCatch(async ({ body, params }, res) => {
      const { msg, name, type, context } = body;
      const itemId = params.id;

      if (!msg || !name || !type || !context) {
        return res.status(400).send({ error: "Erreur avec le message ou avec le nom ou le type" });
      }

      const result = await MaintenanceMessage.findOneAndUpdate({ _id: itemId }, body, {
        new: true,
      });

      return res.json(result);
    })
  );

  router.delete(
    "/:id",
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      const result = await MaintenanceMessage.deleteOne({ _id: itemId });
      return res.json(result);
    })
  );

  return router;
};
