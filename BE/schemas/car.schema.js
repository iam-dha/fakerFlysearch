const Joi = require("joi");

exports.getAvailableCarsSchema = {
  query: Joi.object({
    iata: Joi.string().length(3).uppercase().required()
  })
};

exports.bookCarSchema = {
  body: Joi.object({
    routeId: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
    passenger_name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^0\d{9}$/).optional()
  })
};