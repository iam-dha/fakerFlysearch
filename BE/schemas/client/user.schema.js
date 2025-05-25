const joi = require("joi");
const { otpField, emailField } = require("../sharedFields.schema");

const verifyEmailSchema = {
    body: joi.object({
        otp: otpField,
    }),
};

const changeEmailSchema = {
    body: joi.object({
        newEmail: emailField,
    }),
};

module.exports = {
    verifyEmailSchema,
    changeEmailSchema,
};
