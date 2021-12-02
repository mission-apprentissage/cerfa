const lettersWidth = {
  A: 2,
  B: 2,
  C: 1.8,
  D: 1.8,
  E: 1.8,
  F: 2,
  G: 1.5,
  H: 1.8,
  I: 4,
  J: 2.6,
  K: 2,
  L: 2.3,
  M: 1,
  N: 1.8,
  O: 1.3,
  P: 2,
  Q: 1.7,
  R: 1.7,
  S: 2,
  T: 2.3,
  U: 1.8,
  V: 2,
  W: 1.3,
  X: 3,
  Y: 2,
  Z: 2.3,
  0: 3,
  1: 3,
  2: 2.5,
  3: 3,
  4: 2.5,
  5: 3,
  6: 2.5,
  7: 3,
  8: 3,
  9: 3,
  //TODO Special
  À: 2,
  Á: 2,
  Â: 2,
  Ã: 2,
  Ä: 2,
  Å: 2,
  Æ: 0,
  Ç: 2,
  È: 2,
  É: 2,
  Ê: 2,
  Ë: 2,
  Ì: 4,
  Í: 4,
  Î: 4,
  Ï: 4,
  Ð: 2,
  Ñ: 2,
  Ò: 1.5,
  Ó: 1.5,
  Ô: 1.5,
  Õ: 1.5,
  Ö: 1.5,
  Ø: 1.5,
  Œ: 0,
  Š: 2,
  þ: 3,
  Ù: 2,
  Ú: 2,
  Û: 2,
  Ü: 2,
  Ý: 2,
  Ÿ: 2,
  à: 2,
  á: 2,
  â: 2,
  ã: 2,
  ä: 2,
  å: 2,
  æ: 2,
  ç: 2,
  è: 2,
  é: 2,
  ê: 2,
  ë: 2,
  ì: 2,
  í: 2,
  î: 2,
  ï: 2,
  ð: 2,
  ñ: 2,
  ò: 2,
  ó: 2,
  ô: 2,
  õ: 2,
  ö: 2,
  ø: 2,
  œ: 2,
  š: 2,
  Þ: 2,
  ù: 2,
  ú: 2,
  û: 2,
  ü: 2,
  ý: 2,
  ÿ: 2,
  // µ: 2,
  "£": 2,
  "×": 2,
  "÷": 2,
  "±": 2,
  "·": 4.5,
  "¸": 4,
  "°": 3.5,
  "…": 0,
  "¦": 4.5,
  "?": 2.5,
  "!": 4,
  "+": 2.5,
  "-": 4,
  "=": 2.5,
  "(": 3.5,
  ")": 4,
  "*": 3.5,
  "&": 2,
  "^": 2.5,
  "%": 1,
  $: 2.5,
  "#": 2.5,
  "@": 0,
  "`": 4.5,
  "'": 4.5,
  '"': 2,
  "/": 4,
  " ": 0,
  ".": 4,
};
const findMovePos = (letter, position) => {
  const width = 12;
  const space = 2;
  const letterWidth = lettersWidth[letter];
  return {
    x: position.x + letterWidth,
    y: position.y,
    width,
    space,
  };
};

module.exports = {
  findMovePos,
};
