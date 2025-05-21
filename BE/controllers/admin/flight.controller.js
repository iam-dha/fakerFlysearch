const amadeus = require("../config/amadeus");
const Flight = require("../../models/flight.model");

exports.updateMarketingFields = async (req, res) => {
  const { id } = req.params;
  const {
    thumbnail,
    title,
    description,
    discount_value,
    discount_code
  } = req.body;

  try {
    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (thumbnail !== undefined) flight.thumbnail = thumbnail;
    if (title !== undefined) flight.title = title;
    if (description !== undefined) flight.description = description;
    if (discount_value !== undefined) flight.discount_value = discount_value;
    if (discount_code !== undefined) flight.discount_code = discount_code;

    await flight.save();

    res.status(200).json({ message: "Marketing fields updated", flight });
  } catch (error) {
    console.error("[PATCH /admin/flights/:id] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ departure_date: 1 });
    res.status(200).json({
      message: "All flights retrieved",
      count: flights.length,
      flights
    });
  } catch (error) {
    console.error("[GET /admin/flights] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updatePromotions = async (req, res) => {
  const { id } = req.params;
  const { promotions } = req.body;

  try {
    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (!Array.isArray(promotions)) {
      return res.status(400).json({ message: "Promotions must be an array" });
    }

    flight.promotions = promotions;
    await flight.save();

    res.status(200).json({ message: "Promotions updated", promotions });
  } catch (error) {
    console.error("[PATCH /admin/flights/:id/promotions] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};