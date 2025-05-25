const mongoose = require("mongoose");

const userInformation_schema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        coins : {
            type: Number,
            default: 0
        },
        address: String,
        phone: {
            type: String,
            default: "",
        },
        deleted: {
            type: Boolean, 
            default: false
        },
        status: {
            type: String,
            default: "active"
        },
        deletedAt: Date,
    },
    {
        timestamps: true
    }
);

const UserInformation = mongoose.model("UserInformation", userInformation_schema, "userInformation");
module.exports = UserInformation;