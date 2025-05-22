const Booking = require("../../models/booking.model");
const Flight = require("../../models/flight.model");
const mailer = require("../../services/mailer.service");

module.exports.createBooking = async (req, res) => {
  const userId = req.userId;
  const userEmail = req.email;
  const { flightId, seat_class, passenger_name } = req.body;
  try {
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (flight.seat[seat_class] <= 0) {
      return res.status(400).json({ message: "No available seat in this class" });
    }
    flight.seat[seat_class] -= 1;
    await flight.save();
    const booking = new Booking({
      user: userId,
      flight: flightId,
      seat_class,
      passenger_name,
      payment_status: "pending",
    });
    await booking.save();
    const populatedBooking = await booking.populate("flight");
    await mailer.sendBookingConfirmation(userEmail, populatedBooking);
    res.status(201).json({
      message: "Booking successful and confirmation email sent",
      booking,
    });
  } catch (error) {
    console.error("[POST /api/v1/bookings] Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllBookings = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const bookings = await Booking.find()
      .populate("flight")
      .populate("user", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const count = await Booking.countDocuments();
    res.status(200).json({
      total: count,
      page,
      data: bookings,
    });
  } catch (error) {
    console.error("[GET /admin/bookings] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBookingDetail = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId)
      .populate("flight")
      .populate("user", "email");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ data: booking });
  } catch (error) {
    console.error("[GET /admin/bookings/:id] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  if (!["pending", "paid"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.payment_status = status;
    await booking.save();
    res.status(200).json({ message: "Updated booking status", booking });
  } catch (error) {
    console.error("[PATCH /admin/bookings/:id/status] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
