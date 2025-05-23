const mongoose = require("mongoose");

const seat_schema = new mongoose.Schema({
  economy: { type: Number, required: true },
  premium: { type: Number, required: true },
});


const flight_schema = new mongoose.Schema({
  iata_from: { type: String, required: true },
  iata_to: { type: String, required: true },
  departure_time: { type: String, required: true }, // "HH:mm"
  departure_date: { type: Date, required: true },
  price: { type: Number, required: true },
  seat: { type: seat_schema, required: true },
  flight_number: { type: String, required: true, unique: true },  
  title: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  deleted: { type: Boolean, default: false },
}, {timestamps: true});

module.exports = mongoose.model("Flight", flight_schema,"flights");
