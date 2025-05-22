const Joi = require("joi");

exports.busRouteSchema = {
  body: Joi.object({
    company: Joi.string().required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    departure_time: Joi.string().required(),
    duration_minutes: Joi.number().required(),
    price: Joi.number().required(),
    type: Joi.string().valid("standard", "fast").required(),
    available_seats: Joi.number().min(0)
  })
};

module.exports = {
  busRouteSchema
};