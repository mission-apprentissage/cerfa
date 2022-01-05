const express = require("express");
const tryCatch = require("../../middlewares/tryCatchMiddleware");

const { NotionAPI } = require("notion-client");

const notion = new NotionAPI();

module.exports = () => {
  const router = express.Router();

  router.get(
    "/content/:id",
    tryCatch(async ({ params }, res) => {
      if (params.id !== "6e373f15a9b94a87a5cabde3fa2af0bc" && params.id !== "8b83c43d387f4fc7b7872957807b8c66") {
        throw new Error("Something went wrong");
      }

      const recordMap = await notion.getPage(params.id);

      let pageTitle = "";
      const keys = Object.keys(recordMap.block);
      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        const blockValue = recordMap.block[element].value;
        if (blockValue.type === "page") {
          const title = blockValue.properties.title[0][0];
          if (title !== "Documentation") {
            pageTitle = title;
          }
        }
      }

      return res.json({ ...recordMap, pageTitle });
    })
  );

  return router;
};
