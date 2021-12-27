const { runScript } = require("./scriptWrapper");
const { listStorage, getFromStorage } = require("../common/utils/ovhUtils");
const { oleoduc, writeToStdout } = require("oleoduc");
const archiver = require("archiver");

runScript(async () => {
  const list = await listStorage();
  const archive = archiver("zip", { zlib: { level: 9 } });

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const isLast = i === list.length - 1;
    const name = item.name;

    const stream = await getFromStorage(name);
    archive.append(stream, { name });
    if (isLast) {
      archive.finalize();
    }
  }

  await oleoduc(archive, writeToStdout());
});
