const Joi = require("joi");

module.exports = {
  password: (minLength) =>
    minLength === 20
      ? Joi.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){20,}$/)
      : Joi.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){12,}$/),
};
