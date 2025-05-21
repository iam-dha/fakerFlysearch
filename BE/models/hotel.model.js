const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  stars: { type: Number, min: 1, max: 5, default: 3 },
  iata: { type: String, required: true, uppercase: true }, // khu vực hoạt động theo sân bay
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  contact_email: { type: String, required: true },          // email cộng tác viên
  description: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Hotel", hotelSchema);
