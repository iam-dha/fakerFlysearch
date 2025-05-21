const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const user_schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} not valid!`
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      default: new mongoose.Types.ObjectId("681b1c83f60d2db3126b0e25")
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date,
  },
  {
    strict: false,
    timestamps: true
  }
);

const User = mongoose.model("User", user_schema, "users");
module.exports = User;