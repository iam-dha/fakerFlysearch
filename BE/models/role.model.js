const mongoose = require("mongoose");

const role_schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: String,
        permissions: {
            type: [String],
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
    },
    {
        timestamps: true
    }
);

const Role = mongoose.model("Role", role_schema, "roles");
module.exports = Role;