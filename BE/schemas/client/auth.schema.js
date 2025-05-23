const joi = require("joi");
const {
    emailField,
    passwordField,
    otpField,
    fullNameField,
    addressField,
    phoneField,
    tokenField
} = require("../sharedFields.schema");
// Joi Schema
const loginSchema = joi.object({
    body: joi.object({
        email: emailField,
        password: passwordField,
    }),
});

const emailSchema = joi.object({
    body: joi.object({
        email: emailField,
    }),
});

const registerOtpVerifySchema = joi.object({
    body: joi.object({
        email: emailField,
        otp: otpField,
    }),
});

const registerVerifySchema = joi.object({
    body: joi.object({
        email: emailField,
        password: passwordField,
        token: tokenField,
        fullName: fullNameField,
        address: addressField,
        phone: phoneField
    }),
});

const changePassSchema = joi.object({
    body: joi.object({
        password: passwordField,
        newPassword: passwordField,
        reNewPassword: joi.ref('newPassword')
    })
});

const newPassSchema = joi.object({
    body: joi.object({
        newPassword: passwordField,
        reNewPassword: joi.ref('newPassword')
    }),
    params: joi.object({
        token: joi.string().length(16).required(), //trong sharedFields để là 16 mà 
    })
})

module.exports = {
    loginSchema,
    emailSchema,
    registerVerifySchema,
    changePassSchema,
    newPassSchema,
    registerOtpVerifySchema
};
