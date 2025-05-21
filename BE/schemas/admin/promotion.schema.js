const Joi = require("joi");

const basePromotionSchema = {
  label: Joi.string().max(100).required(),
  description: Joi.string().max(500).allow(""),
  code: Joi.string().alphanum().max(50).required(),
  thumbnail: Joi.string().uri().allow(""),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  totalSlot: Joi.number().integer().min(0).required(),
  isIncluded: Joi.boolean().required(),
  isActive: Joi.string().valid("active", "inactive").required(),
  discountValue: Joi.number().min(0).required()
};

exports.createPromotionValidator = {
  body: Joi.object(basePromotionSchema)
};

exports.updatePromotionValidator = {
  body: Joi.object({
    label: Joi.string().max(100),
    description: Joi.string().max(500).allow(""),
    code: Joi.string().alphanum().max(50),
    thumbnail: Joi.string().uri().allow(""),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref("startDate")),
    totalSlot: Joi.number().integer().min(0),
    isIncluded: Joi.boolean(),
    isActive: Joi.string().valid("active", "inactive"),
    discountValue: Joi.number().min(0)
  })
};
