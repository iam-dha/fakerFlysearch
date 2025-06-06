const Joi = require("joi");

exports.bookHotelSchema = {
  body: Joi.object({
    hotelId: Joi.string()
      .regex(/^[a-f\d]{24}$/i)
      .required(),

    check_in: Joi.date()
      .iso()
      .required(),

    check_out: Joi.date()
      .iso()
      .greater(Joi.ref("check_in"))
      .required(),

    rooms: Joi.array()
      .items(
        Joi.object({
          room: Joi.string()
            .regex(/^[a-f\d]{24}$/i)
            .required(),
          quantity: Joi.number().integer().min(1).required()
        })
      )
      .min(1)
      .required()
  })
};

exports.getRoomsByIataAndDateSchema = {
  query: Joi.object({
    iata: Joi.string().length(3).uppercase().required(),
    check_in: Joi.date().iso().required(),
    check_out: Joi.date().iso().greater(Joi.ref("check_in")).required()
  })
};

exports.getHotelListSchema = {
  query: Joi.object({
    iata: Joi.string().length(3).uppercase().optional()
  })
};

exports.getRoomsByHotelIdSchema = {
  params: Joi.object({
    hotelId: Joi.string()
      .regex(/^[a-f\d]{24}$/i)
      .required()
      .messages({
        "string.pattern.base": "Invalid hotelId format"
      })
  }),

  query: Joi.object({
    type: Joi.string().valid("standard", "deluxe").optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  })
};
