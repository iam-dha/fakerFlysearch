const mongoose = require('mongoose');
const systemConfig = require("../config/system.js");

const passenger_schema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["adult", "child", "infant"], required: true },
  price: { type: Number, required: true }
}, { _id: false });

const addon_schema = new mongoose.Schema({
  type: { type: String, enum: ["baggage", "meal", "priority"] },
  label: { type: String, default: "" },
  price: { type: Number, default: 0 }
}, { _id: false });

const booking_schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  seat_class: { type: String, enum: ["ECONOMY", "PREMIUM"], required: true },
  passengers: { type: [passenger_schema], required: true },
  addons: { type: [addon_schema], default: [] },
  total_price: { type: Number, required: true },
  payment_status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending"
  },
  hold_until: {
    type: Date,
    default: () => new Date(Date.now() + systemConfig.bookingHoldMinutes * 60 * 1000)
  },
  promotion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion",
    default: null
  },
  discountValue: { type: Number, default: 0 },
  is_notified: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Booking', booking_schema, "booking");