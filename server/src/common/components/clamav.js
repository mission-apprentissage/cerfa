const NodeClam = require("clamscan");
var tcpPortUsed = require("tcp-port-used");

let promise;
async function getClamscan(uri) {
  if (promise) {
    return promise;
  }

  return new Promise((resolve, reject) => {
    let [host, port] = uri.split(":");
    tcpPortUsed
      .waitUntilUsedOnHost(parseInt(port), host, 500, 30000)
      .then(() => {
        let clamscan = new NodeClam().init({
          clamdscan: {
            host,
            port,
          },
        });
        resolve(clamscan);
      })
      .catch(reject);
  });
}

module.exports = async (uri) => {
  async function getScanner() {
    let clamscan = await getClamscan(uri);
    let scanStream = clamscan.passthrough();
    let scanResults = new Promise((resolve) => {
      scanStream.on("scan-complete", (res) => {
        resolve(res);
      });
    });

    return {
      scanStream,
      getScanResults: () => scanResults,
    };
  }

  return { getScanner };
};
