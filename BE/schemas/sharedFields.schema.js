const joi = require("joi");

// const passwordField = joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/).required();
const passwordField = joi
  .string()
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must be at least 8 characters and include lowercase, uppercase, number, and special character",
  });
const emailField = joi.string().email().required();
const otpField = joi.number().integer().max(999999).min(100000).required();
const fullNameField = joi.string().min(6).max(30).required();
const addressField = joi.string().max(100);
const phoneField = joi.string().pattern(/^0\d{9}$/);
const folderNameField = joi.string().max(50).required();
const descriptionField = joi.string().max(200);
const tagField = joi.string().max(30);
const booleanField = joi.boolean();
const flashcardId = joi.string();
const tokenField = joi.string().length(16).required();
const postTitleField = joi.string().max(256).required();
const imageUrlField = joi.string().uri();
const postContentField = joi.string().required();
const roleTitleField = joi.string().max(20).required();
const discountValueField = joi.number().integer().min(0).max(100).required();
const dateField = joi.date().iso();
const promotionSlot = joi.number().integer().min(0);
module.exports = {
    passwordField,
    emailField,
    otpField,
    fullNameField,
    addressField,
    phoneField,
    folderNameField,
    descriptionField,
    tagField,
    booleanField,
    flashcardId,
    tokenField,
    postTitleField,
    imageUrlField,
    postContentField,
    roleTitleField,
    discountValueField,
    dateField,
    promotionSlot
};
