const joi = require("joi");

const {
    descriptionField,
    discountValueField,
    dateField,
    promotionSlot,
    booleanField,
    imageUrlField
} = require("../sharedFields.schema");

const promotionSchema = joi.object({
    body: joi.object({
        label: joi.string().required(),
        description: descriptionField,
        code: joi.string().required(),
        thumbnail: imageUrlField,
        startDate: dateField,
        endDate: dateField.greater(joi.ref("startDate")),
        totalSlot: promotionSlot,
        isIncluded: booleanField,
        isActive: booleanField,
        discountValue: discountValueField,
    }),
});

module.exports = { promotionSchema };
