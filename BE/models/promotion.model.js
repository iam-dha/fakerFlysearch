const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const promotion_schema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    code: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        default: "",
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: Date.now + 7 * 24 * 60 * 60 * 1000,
    },
    totalSlot: {
        type: Number,
        default: 0,
    },
    isIncluded: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        enum: ["active", "inactive"],
        default: "active",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    discountValue: {
        type: Number,
        default: 0,
    },
    slug: {
        type: String,
        slug: "label",
        unique: true
    }
},
    {
        timestamps: true,
    }
);

const Promotion = mongoose.model("Promotion", promotion_schema, "promotions");
module.exports = Promotion;
