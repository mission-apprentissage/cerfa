const express = require("express");
const { MaintenanceMessage } = require("../../common/model/index");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const pageAccessMiddleware = require("../middlewares/pageAccessMiddleware");

module.exports = (checkJwtToken) => {
  const router = express.Router();

  router.get(
    "/",
    tryCatch(async (req, res) => {
      const result = await MaintenanceMessage.find({});
      return res.json(result);
    })
  );

  router.post(
    "/",
    checkJwtToken,
    pageAccessMiddleware(["admin/page_message_maintenance"]),
    tryCatch(async ({ body }, res) => {
      const { msg, name, type, enabled, context } = body;

      if (!msg || !name || !type || enabled === undefined) {
        return res.status(400).send({ error: "Erreur avec le message ou avec le nom ou le type ou enabled" });
      }
      const newMaintenanceMessage = new MaintenanceMessage({
        type,
        context,
        name,
        // TODO quick bypass https://github.com/coreruleset/coreruleset/blob/v4.1/dev/rules/REQUEST-949-BLOCKING-EVALUATION.conf
        msg: msg.replace(/(\[.*?\])\(##(.*?)\)/gim, "$1($2)"),
        enabled,
        time: new Date(),
      });

      await newMaintenanceMessage.save();

      return res.json(newMaintenanceMessage);
    })
  );

  router.put(
    "/:id",
    checkJwtToken,
    pageAccessMiddleware(["admin/page_message_maintenance"]),
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
    checkJwtToken,
    pageAccessMiddleware(["admin/page_message_maintenance"]),
    tryCatch(async (req, res) => {
      const itemId = req.params.id;
      const result = await MaintenanceMessage.deleteOne({ _id: itemId });
      return res.json(result);
    })
  );

  return router;
};
