const spaced = (str, spacing = 2) => {
  return str.toUpperCase().split("").join(" ".repeat(spacing));
};
const lettersWidth = {
  A: 1,
  B: 1,
  C: 0.8,
  D: 0.8,
  E: 0.8,
  F: 1,
  G: 0.5,
  H: 0.8,
  I: 1,
  J: 1,
  K: 1,
  L: 1,
  M: 1,
  N: 1,
  O: 0.3,
  P: 1,
  Q: 1,
  R: 1,
  S: 1,
  T: 1.3,
  U: 1,
  V: 1,
  W: 1,
  X: 1,
  Y: 1,
  Z: 1,
  " ": 1,
  ".": 3.5,
};
const findMovePos = (letter, position) => {
  const width = 10;
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
  spaced,
  findMovePos,
};
