const Joi = require("joi");

exports.createOrUpdateSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    logo: Joi.string().uri().allow(""),
    description: Joi.string().allow(""),
    contact: Joi.object({
      phone: Joi.string().allow(""),
      email: Joi.string().email().allow(""),
      website: Joi.string().uri().allow("")
    }).optional()
  })
};

module.exports = {
  createOrUpdateSchema
};