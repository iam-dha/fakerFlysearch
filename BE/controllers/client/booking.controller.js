const Booking = require("../../models/booking.model");
const Flight = require("../../models/flight.model");
const mailer = require("../../services/mailer.service");

exports.mockPayment = async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.userId;
  const email = req.email;
  try {
    const booking = await Booking.findOne({ _id: bookingId, user: userId }).populate("flight");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.payment_status === "paid") {
      return res.status(400).json({ message: "Booking already paid" });
    }
    booking.payment_status = "paid";
    await booking.save();
    await mailer.sendBookingConfirmation(email, booking);
    res.status(200).json({
      message: "Payment successful, confirmation email sent",
      booking,
    });
  } catch (error) {
    console.error(`[POST /api/v1/bookings/${bookingId}/pay] Error:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getUserBookings = async (req, res) => {
  const userId = req.userId;
  try {
    const bookings = await Booking.find({ user: userId })
      .populate("flight")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User booking history",
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("[GET /api/v1/bookings] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const calculatePassengerPrice = (base, type) => {
  if (type === "adult") return base;
  if (type === "child") return base * 0.75;
  if (type === "infant") return base * 0.1;
  return 0;
};

exports.createBookingFromFullsearch = async (req, res) => {
  const userId = req.userId;
  const email = req.email;
  const { flightId, returnFlightId, seat_class, passenger_list, addons = [] } = req.body;

  try {
    const outbound = await Flight.findById(flightId);
    if (!outbound) {
      return res.status(404).json({ message: "Outbound flight not found" });
    }

    const seatKey = seat_class.toLowerCase();
    if (outbound.seat[seatKey] < passenger_list.length) {
      return res.status(400).json({ message: "Not enough seats on outbound flight" });
    }

    let inbound = null;
    if (returnFlightId) {
      inbound = await Flight.findById(returnFlightId);
      if (!inbound) {
        return res.status(404).json({ message: "Return flight not found" });
      }
      if (inbound.seat[seatKey] < passenger_list.length) {
        return res.status(400).json({ message: "Not enough seats on return flight" });
      }
    }

    const buildPassengers = (basePrice) =>
      passenger_list.map(p => ({
        name: p.fullName,
        type: p.type,
        price: calculatePassengerPrice(basePrice, p.type)
      }));

    const outboundPassengers = buildPassengers(outbound.price);
    const outboundPassengerTotal = outboundPassengers.reduce((sum, p) => sum + p.price, 0);
    const addonTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const outboundTotal = outboundPassengerTotal + addonTotal;

    const outboundBooking = new Booking({
      user: userId,
      flight: outbound._id,
      seat_class,
      passengers: outboundPassengers,
      addons,
      total_price: outboundTotal,
      payment_status: "pending"
    });

    outbound.seat[seatKey] -= passenger_list.length;
    await outbound.save();
    await outboundBooking.save();

    let returnBooking = null;
    if (inbound) {
      const inboundPassengers = buildPassengers(inbound.price);
      const inboundTotal = inboundPassengers.reduce((sum, p) => sum + p.price, 0);

      returnBooking = new Booking({
        user: userId,
        flight: inbound._id,
        seat_class,
        passengers: inboundPassengers,
        addons,
        total_price: inboundTotal + addonTotal,
        payment_status: "pending"
      });

      inbound.seat[seatKey] -= passenger_list.length;
      await inbound.save();
      await returnBooking.save();
    }

    res.status(201).json({
      message: "Booking successful",
      outbound_booking: outboundBooking,
      return_booking: returnBooking || null
    });
  } catch (error) {
    console.error("[POST /api/v1/bookings] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBookingById = async (req, res) => {
  const userId = req.userId;
  const bookingId = req.params.bookingId;

  try {
    const booking = await Booking.findOne({ _id: bookingId, user: userId }).populate("flight");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking details", booking });
  } catch (error) {
    console.error("[GET /api/v1/bookings/:bookingId] Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
