const joi = require("joi");
const {
    emailField,
    passwordField,
    otpField,
    fullNameField,
    addressField,
    phoneField,
    tokenField,
} = require("../sharedFields.schema");
// Joi Schema
const validateLogin = {
  body: joi.object({
    email: joi.string().email().required(),
    password: passwordField
})};

const emailSchema = {
    body: joi.object({
        email: emailField,
    }),
};

const registerOtpVerifySchema = {
    body: joi.object({
        email: emailField,
        otp: otpField,
    }),
};

const registerVerifySchema = {
    body: joi.object({
        email: emailField,
        password: passwordField,
        fullName: fullNameField,
        address: addressField,
        phone: phoneField,
    }),
};

const changePassSchema = {
    body: joi.object({
        password: passwordField,
        newPassword: passwordField,
        reNewPassword: joi.ref("newPassword"),
    }),
};

const newPassSchema = {
    body: joi.object({
        newPassword: passwordField,
        reNewPassword: joi.ref("newPassword"),
    }),
    params: joi.object({
        token: joi.string().length(16).required(), //trong sharedFields để là 16 mà
    }),
};

module.exports = {
    validateLogin,
    emailSchema,
    registerVerifySchema,
    changePassSchema,
    newPassSchema,
    registerOtpVerifySchema,
};
