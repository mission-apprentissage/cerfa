const crypto = require("crypto");

module.exports = (key) => {
  function cipher(iv) {
    if (!key || !iv) {
      throw new Error("Impossible chiffrer la donnée");
    }

    //See https://crypto.stackexchange.com/a/3970/60417 for more informations about vector
    return crypto.createCipheriv("aes-256-cbc", key, iv.slice(0, 16));
  }

  function decipher(iv) {
    return crypto.createDecipheriv("aes-256-cbc", key, iv);
  }

  function available() {
    return !!key;
  }

  return { cipher, decipher, available };
};