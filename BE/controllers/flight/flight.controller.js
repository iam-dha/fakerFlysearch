const amadeus = require("../../config/amadeus");
const Flight = require("../../models/flight.model");

module.exports.searchAndStoreFlights = async (req, res) => {
  const { from, to, date } = req.query;

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: date,
      adults: "1",
      nonStop: true,
      currencyCode: "VND",
      max: 5,
    });

    const results = [];

    for (const offer of response.data) {
      const segment = offer.itineraries[0].segments[0];

      const flightData = {
        iata_from: segment.departure.iataCode,
        iata_to: segment.arrival.iataCode,
        departure_date: new Date(segment.departure.at.split("T")[0]),
        departure_time: segment.departure.at.split("T")[1].slice(0, 5),
        price: parseFloat(offer.price.total),
        seat: { economy: 50, premium: 10 }, 
      };

      const exists = await Flight.findOne({
        iata_from: flightData.iata_from,
        iata_to: flightData.iata_to,
        departure_date: flightData.departure_date,
        departure_time: flightData.departure_time,
      });

      if (!exists) {
        const saved = await Flight.create(flightData);
        results.push(saved);
      }
    }

    res.json({
      message: "Flights fetched and saved (if not exist)",
      saved: results.length,
      results,
    });
  } catch (error) {
    console.error("Amadeus search/store error:", error);
    res.status(500).json({ message: "Failed to fetch/store flights" });
  }
};

const calculateTotalPrice = (basePrice, passengers) => {
  const { adults, children, infants } = passengers;
  return (
    basePrice * adults +
    basePrice * 0.75 * children +
    basePrice * 0.1 * infants
  );
};

exports.fullSearchHandler = async (req, res) => {
  const {
    from,
    to,
    departureDate,
    returnDate,
    seat_class,
    passengers
  } = req.fullsearch;

  try {
    // Go one-way
    const outbound = await Flight.find({
      iata_from: from,
      iata_to: to,
      departure_date: departureDate,
      [`seat.${seat_class.toLowerCase()}`]: { $gt: 0 },
    }).sort({ departure_time: 1 });

    const outboundWithPrice = outbound.map(f => ({
      flight: f,
      total_price: calculateTotalPrice(f.price, passengers)
    }));

    // If return trip requested
    let inboundWithPrice = [];
    if (returnDate) {
      const inbound = await Flight.find({
        iata_from: to,
        iata_to: from,
        departure_date: returnDate,
        [`seat.${seat_class.toLowerCase()}`]: { $gt: 0 },
      }).sort({ departure_time: 1 });

      inboundWithPrice = inbound.map(f => ({
        flight: f,
        total_price: calculateTotalPrice(f.price, passengers)
      }));
    }

    res.status(200).json({
      message: "Full search results",
      outbound: outboundWithPrice,
      inbound: inboundWithPrice
    });
  } catch (error) {
    console.error("[GET /flights/fullsearch] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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