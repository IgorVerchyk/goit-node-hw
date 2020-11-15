const Joi = require("joi");
const { HttpCode } = require("../helpers/constants");

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).optional(),
  email: Joi.string().alphanum().min(2).max(30).optional(),
  phone: Joi.number().integer().min(6).max(10).optional(),
});

const validate = (schema, body, next) => {
  const { error } = schema.validate(body);
  if (error) {
    return next({
      status: HttpCode.BAD_REQUEST,
      message: "Missing required name field",
      data: "Bad Request",
    });
  }
  next();
};

module.exports.validateContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next);
};
