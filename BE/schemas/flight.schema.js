const Joi = require("joi");

exports.searchFlightSchema = Joi.object({
  from: Joi.string().length(3).uppercase().required(), //IATA
  to: Joi.string().length(3).uppercase().required(),
  date: Joi.date().iso().required()
});

exports.fullsearchQuerySchema = Joi.object({
  ap: Joi.string().pattern(/^[A-Z]{3}\.[A-Z]{3}$/).required(),
  dt: Joi.string().pattern(/^\d{1,2}-\d{1,2}-\d{4}\.(NA|\d{1,2}-\d{1,2}-\d{4})$/).required(),
  ps: Joi.string().pattern(/^\d+\.\d+\.\d+$/).required(),
  sc: Joi.string().valid("ECONOMY", "PREMIUM").optional()
});

exports.updateMarketingFieldsValidator = {
  body: Joi.object({
    thumbnail: Joi.string().uri().optional(),
    title: Joi.string().max(200).optional(),
    description: Joi.string().max(500).optional(),
    discount_value: Joi.number().min(0).max(100).optional(),
    discount_code: Joi.string().alphanum().max(50).optional()
  })
};

exports.updatePromotionsValidator = {
  body: Joi.object({
    promotions: Joi.array().items(
      Joi.object({
        label: Joi.string().max(100).required(),
        description: Joi.string().max(500).allow(""),
        code: Joi.string().alphanum().max(50).required(),
        discount_value: Joi.number().min(0).max(100).required()
      })
    ).required()
  })
};

exports.confirmPriceSchema = {
  body: Joi.object({
    flightOffer: Joi.object().unknown(true).required()
  })
};
exports.flightFullSchema = Joi.object({
  body: Joi.object({
    iata_from: Joi.string().length(3).uppercase().required(),
    iata_to: Joi.string().length(3).uppercase().required(),
    departure_time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
    departure_date: Joi.date().iso().required(),
    flight_number: Joi.string().alphanum().max(10).required(),
    price: Joi.number().min(0).required(),
    seat: Joi.object({
      economy: Joi.number().integer().min(0).required(),
      premium: Joi.number().integer().min(0).required()
    }).required(),
    title: Joi.string().max(200).required(),
    thumbnail: Joi.string().uri().optional()
  })
});

exports.confirmPriceSchema = {
  body: Joi.object({
    flightOffer: Joi.object().unknown(true).required()
  })
};