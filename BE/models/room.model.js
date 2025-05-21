const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  type: { type: String, enum: ["standard", "deluxe"], required: true },
  price: { type: Number, required: true },
  available_rooms: { type: Number, required: true },
  max_guests: { type: Number, required: true },
  description: { type: String, default: "" },
  thumbnails: { type: [String], default: [] },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
