const Joi = require("joi");

module.exports = {
  password: () => Joi.string().regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/),
};
