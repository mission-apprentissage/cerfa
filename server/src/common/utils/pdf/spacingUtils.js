const spaced = (str, spacing = 2) => {
  return str.toUpperCase().split("").join(" ".repeat(spacing));
};

module.exports = {
  spaced,
};
