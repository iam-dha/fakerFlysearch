const Booking = require("../../models/booking.model");
const Flight = require("../../models/flight.model");

const releaseExpiredBookings = async () => {
  const now = new Date();
  const expired = await Booking.find({
    payment_status: "pending",
    hold_until: { $lt: now }
  });

  for (const booking of expired) {
    const flight = await Flight.findById(booking.flight);
    if (flight && flight.seat[booking.seat_class.toLowerCase()] !== undefined) {
      flight.seat[booking.seat_class.toLowerCase()] += booking.passengers.length;
      await flight.save();
    }

    booking.payment_status = "cancelled";
    await booking.save();
  }

  console.log(`[Timeout Job] Released ${expired.length} expired bookings.`);
};

module.exports = releaseExpiredBookings;