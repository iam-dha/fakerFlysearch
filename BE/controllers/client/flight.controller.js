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
      max: 10,
    });

    const results = [];
    const flightOffers = response.data.slice(0, 3);
    let saved = 0;

    for (const offer of flightOffers) {
      const segment = offer.itineraries[0].segments[0];
      const flight_number = `${segment.carrierCode}${segment.number}`;
      const flightData = {
        iata_from: segment.departure.iataCode,
        iata_to: segment.arrival.iataCode,
        departure_date: new Date(segment.departure.at.split("T")[0]),
        departure_time: segment.departure.at.split("T")[1].slice(0, 5),
        price: parseFloat(offer.price.total),
        seat: { economy: 50, premium: 10 },
      };

      const exists = await Flight.findOne({
        flight_number,
        departure_date: flightData.departure_date
      });

      if (!exists) {
        const newFlight = new Flight({
          iata_from: segment.departure.iataCode,
          iata_to: segment.arrival.iataCode,
          departure_time: segment.departure.at.slice(11, 16), // HH:mm
          departure_date: date,
          price: Number(offer.price.total),
          seat: {
            economy: 50,
            premium: 10,
          },
          flight_number,
          title: `${segment.carrierCode} ${segment.number}`,
        });

        await newFlight.save();
        saved++;
      }
    }

    res.json({
      message: "Flights fetched and saved (if not exist)",
      saved,
      results: await Flight.find({
        iata_from: from,
        iata_to: to,
        departure_date: date,
      }),
      originalFlightOffers: flightOffers,
    });
  } catch (error) {
    console.error(
      "Amadeus search/store error:",
      JSON.stringify(error, null, 2)
    );
    return res.status(500).json({
      message: "Failed to fetch/store flights",
      error: error.response?.data || error.message,
    });
  }
};

exports.confirmFlightPrice = async (req, res) => {
  const { flightOffer } = req.body;

  if (!flightOffer) {
    return res.status(400).json({ message: "Missing flightOffer" });
  }

  try {
    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [flightOffer],
        },
      })
    );

    return res.status(200).json({
      message: "Price confirmed",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Confirm price error:",
      error.response?.data || error.message || error
    );
    return res.status(500).json({
      message: "Failed to confirm price with Amadeus",
      error: error.response?.data || error.message || "Unknown error",
    });
  }
};

// const calculateTotalPrice = (basePrice, passengers) => {
//   const { adults, children, infants } = passengers;
//   return (
//     basePrice * adults + basePrice * 0.75 * children + basePrice * 0.1 * infants
//   );
// };

// exports.fullSearchHandler = async (req, res) => {
//   const { from, to, departureDate, returnDate, passengers, seat_class } =
//     req.fullsearch;

//   try {
//     const seatKey = `seat.${seat_class.toLowerCase()}`;

//     const outbound = await Flight.find({
//       iata_from: from,
//       iata_to: to,
//       departure_date: departureDate,
//       [seatKey]: { $gt: 0 },
//       deleted: false,
//     }).sort({ departure_time: 1 });

//     const outboundWithPrice = outbound.map((f) => ({
//       ...f._doc,
//       total_price: calculateTotalPrice(f.price, passengers),
//     }));

//     let inboundWithPrice = [];
//     if (returnDate) {
//       const inbound = await Flight.find({
//         iata_from: to,
//         iata_to: from,
//         departure_date: returnDate,
//         [seatKey]: { $gt: 0 },
//         deleted: false,
//       }).sort({ departure_time: 1 });

//       inboundWithPrice = inbound.map((f) => ({
//         ...f._doc,
//         total_price: calculateTotalPrice(f.price, passengers),
//       }));
//     }

//     res.status(200).json({
//       message: "Full search results",
//       outbound: outboundWithPrice,
//       inbound: inboundWithPrice,
//     });
//   } catch (error) {
//     console.error("[GET /flights/fullsearch] Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const parsePassengerString = (ps) => {
  const [adults, children, infants] = ps.split(".").map(Number);
  return { adults, children, infants };
};

exports.fullSearchHandler = async (req, res) => {
  const { ap, dt, ps, sc } = req.query;

  try {
    const [from, to] = ap.split(".");
    const [departureDate, returnDateRaw] = dt.split(".");
    const passengers = parsePassengerString(ps);
    const seat_class = sc || "ECONOMY";

    const searchParams = {
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: formatDate(departureDate),
      adults: String(passengers.adults || 1),
      children: String(passengers.children || 0),
      infants: String(passengers.infants || 0),
      travelClass: seat_class,
      currencyCode: "VND",
      max: 10,
    };

    const departureSearch = await amadeus.shopping.flightOffersSearch.get(
      searchParams
    );

    let returnSearch = null;
    if (returnDateRaw !== "NA") {
      const returnParams = {
        originLocationCode: to,
        destinationLocationCode: from,
        departureDate: formatDate(returnDateRaw),
        adults: String(passengers.adults || 1),
        children: String(passengers.children || 0),
        infants: String(passengers.infants || 0),
        travelClass: seat_class,
        currencyCode: "VND",
        max: 10,
      };
      returnSearch = await amadeus.shopping.flightOffersSearch.get(
        returnParams
      );
    }

    return res.status(200).json({
      message: "Fetched from Amadeus",
      outbound: departureSearch.data,
      inbound: returnSearch ? returnSearch.data : [],
    });
  } catch (error) {
    console.error(
      "[GET /flights/fullsearch] Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Failed to fetch from Amadeus",
      error: error.response?.data || error.message,
    });
  }
};

const formatDate = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
