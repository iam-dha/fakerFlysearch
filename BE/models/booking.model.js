const mongoose = require('mongoose');

const passenger_schema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["adult", "child", "infant"], required: true },
  price: { type: Number, required: true }
});

const addon_schema = new mongoose.Schema({
  type: { type: String, enum: ["baggage", "meal", "priority"] },
  label: String,
  price: Number
});

const booking_schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  seat_class: { type: String, enum: ["ECONOMY", "PREMIUM"], required: true },
  passengers: { type: [passenger_schema], required: true },
  addons: { type: [addon_schema], default: [] },
  total_price: { type: Number, required: true },
  payment_status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  hold_until: { type: Date, default: () => Date.now() + 15 * 60 * 1000 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', booking_schema, "bookings");