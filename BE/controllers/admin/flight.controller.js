const Flight = require("../../models/flight.model");

// [GET] /api/v1/admin/flights?page=1&limit=10&filter=createdAt&order=desc
module.exports.getAllFlights = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
        parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc" } = req.query;
    const sortFields = [
        "createdAt",
        "updatedAt",
        "iata_from",
        "iata_to",
        "departure_time",
        "departure_date",
        "price",
    ];
    const sortFilter = sortFields.includes(filter) ? filter : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;
    try {
        const flights = await Flight.find({
            deleted: false,
        })
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .sort({ [sortFilter]: sortOrder }).lean();
        const flightsCount = await Flight.countDocuments({
            deleted: false,
        });
        return res.status(200).json({
            message: "Get flights successfully",
            data: {
                totalCount: flightsCount,
                currentPage: page,
                totalPages: Math.ceil(flightsCount / limit),
                flights: flights,
            },
        });
    } catch (error) {
        console.error(`[GET /api/v1/admin/flights] Error:`, error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

// [GET] /api/v1/admin/flights/:flight_number
module.exports.getFlight = async (req, res) => {
  const { flight_number } = req.params;
  try {
    const flight = await Flight.findOne({
      flight_number: flight_number,
      deleted: false,
    }).select("-__v").lean();
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    return res.status(200).json({
      message: "Get flight successfully",
      data: flight,
    });
  } catch (error) {
    console.error(`[GET /api/v1/admin/flights/${flight_number}] Error:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// [POST] /api/v1/admin/flights
module.exports.createFlight = async (req, res) => {
  const {
    iata_from,
    iata_to,
    departure_time,
    departure_date,
    flight_number,
    price,
    seat,
    title,
    thumbnail = "",
  } = req.body;
  try {
    const isExistingFlight = await Flight.findOne({ 
      flight_number: flight_number,
      deleted: false,
    });
    if (isExistingFlight) {
      return res.status(400).json({
        message: "Flight with this flight number already exists",
      });
    }
    const newFlight = new Flight({
      iata_from,
      iata_to,
      departure_time,
      departure_date,
      flight_number,
      price,
      seat,
      title,
      thumbnail,
    });
    await newFlight.save();
    const flightObj = newFlight.toObject();
    delete flightObj.__v;
    delete flightObj._id;
    return res.status(201).json({
      message: "Create flight successfully",
      data: flightObj,
    });
  } catch (error) {
    console.error(`[POST /api/v1/admin/flights] Error:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// [PATCH] /api/v1/admin/flights/:flight_number
module.exports.updateFlight = async (req, res) => {
  const { flight_number } = req.params;
  const {
    iata_from,
    iata_to,
    departure_time,
    departure_date,
    price,
    seat,
    title,
    thumbnail = "",
  } = req.body;
  try {
    const flight = await Flight.findOne({
      flight_number: flight_number,
      deleted: false,
    });
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    flight.iata_from = iata_from;
    flight.iata_to = iata_to;
    flight.departure_time = departure_time;
    flight.departure_date = departure_date;
    flight.price = price;
    flight.seat = seat;
    flight.title = title;
    flight.thumbnail = thumbnail;
    await flight.save();
    const flightObj = flight.toObject();
    delete flightObj.__v;
    delete flightObj._id;
    return res.status(200).json({
      message: "Update flight successfully",
      data: flightObj,
    });
  } catch (error) {
    console.error(`[PATCH /api/v1/admin/flights/${flight_number}] Error:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// [DELETE] /api/v1/admin/flights/:flight_number
module.exports.deleteFlight = async (req, res) => {
  const { flight_number } = req.params;
  try {
    const flight = await Flight.findOne({
      flight_number: flight_number,
      deleted: false,
    });
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    flight.deleted = true;
    await flight.save();
    return res.status(200).json({
      message: "Delete flight successfully",
    });
  } catch (error) {
    console.error(`[DELETE /api/v1/admin/flights/${flight_number}] Error:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
}