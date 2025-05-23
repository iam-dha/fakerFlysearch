const mongoose = require("mongoose");

const busCompany_schema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: {
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  description: { type: String, default: "" },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("BusCompany", busCompany_schema, "bus_company");

const busRoute_schema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "BusCompany", required: true },
  logo: { type: String, default: "" },
  from_iata: { type: String, required: true, uppercase: true }, // e.g. SGN, HAN
  car_type: { type: String, required: true },                   // e.g. Sedan
  service_type: { type: String, enum: ["standard", "fast"], default: "standard" },
  price: { type: Number, required: true },                      // price per car
  max_passengers: { type: Number, required: true },
  max_baggage: { type: Number, required: true },
  is_24h: { type: Boolean, default: false },                    // Available 24 hours
  has_pickup: { type: Boolean, default: false },                // Convenient pick-up
  is_all_inclusive: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("BusRoute", busRoute_schema, "bus_route");