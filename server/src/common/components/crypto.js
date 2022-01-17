const crypto = require("crypto");
const checksumStream = require("checksum-stream");

module.exports = (key) => {
  function isCipherAvailable() {
    return !!key;
  }

  function cipher(iv) {
    if (!key || !iv) {
      throw new Error("Impossible chiffrer la donnée");
    }

    //See https://crypto.stackexchange.com/a/3970/60417 for more informations about vector
    return crypto.createCipheriv("aes-256-cbc", key, iv.slice(0, 16));
  }

  function decipher(iv) {
    return crypto.createDecipheriv("aes-256-cbc", key, iv.slice(0, 16));
  }

  function checksum() {
    let stream = checksumStream({
      algorithm: "md5",
    });

    let promise = new Promise((resolve, reject) => {
      stream.on("digest", resolve);
      stream.on("error", reject);
    });

    return {
      hashStream: stream,
      getHash: () => promise,
    };
  }

  return { cipher, decipher, isCipherAvailable, checksum };
};
