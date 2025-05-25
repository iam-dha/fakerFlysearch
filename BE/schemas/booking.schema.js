const Joi = require("joi");


const createBookingValidator = {
  body: Joi.object({
    flightId: Joi.string().required(),
    returnFlightId: Joi.string().optional(),
    seat_class: Joi.string().valid("ECONOMY", "PREMIUM").required(),
    passenger_list: Joi.array()
      .items(
        Joi.object({
          fullName: Joi.string().min(2).max(100).required(),
          type: Joi.string().valid("adult", "child", "infant").required()
        })
      )
      .min(1)
      .required(),
    addons: Joi.array().items(
      Joi.object({
        type: Joi.string().valid("baggage", "meal", "priority").required(),
        label: Joi.string().required(),
        price: Joi.number().min(0).required()
      })
    ).optional()
  })
};

module.exports = {
  createBookingValidator
};
