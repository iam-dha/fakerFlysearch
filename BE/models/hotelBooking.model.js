const mongoose = require("mongoose");

const hotelBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  rooms: [
    {
      room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
      quantity: { type: Number, default: 1 }
    }
  ],
  check_in: { type: Date, required: true },
  check_out: { type: Date, required: true },
  total_price: { type: Number, required: true },
  payment_status: { type: String, enum: ["pending", "paid", "cancelled"], default: "pending" },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("HotelBooking", hotelBookingSchema);
