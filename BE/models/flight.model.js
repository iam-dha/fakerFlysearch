const mongoose = require("mongoose");

const seat_schema = new mongoose.Schema({
  economy: { type: Number, required: true },
  premium: { type: Number, required: true },
});

const promotion_schema = new mongoose.Schema({
  label: { type: String, required: true },
  description: { type: String, default: "" },
  code: { type: String, required: true },
  discount_value: { type: Number, default: 0 }
});

const flight_schema = new mongoose.Schema({
  iata_from: { type: String, required: true },
  iata_to: { type: String, required: true },
  departure_time: { type: String, required: true }, // "HH:mm"
  departure_date: { type: Date, required: true },
  price: { type: Number, required: true },
  seat: { type: seat_schema, required: true },

   title: { type: String, required: true },
  thumbnail: { type: String, default: "" },

  promotions: { type: [promotion_schema], default: [] }
});

module.exports = mongoose.model("Flight", flight_schema,"flight");
