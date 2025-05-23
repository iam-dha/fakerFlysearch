const Booking = require("../models/booking.model");
const Flight = require("../models/flight.model");

const releaseExpiredBookings = async () => {
  const now = new Date();

  try {
    const expired = await Booking.find({
      payment_status: "pending",
      hold_until: { $lt: now },
      deleted: false
    });

    let releasedCount = 0;
    const seatRecoveryLog = { ECONOMY: 0, PREMIUM: 0 };

    for (const booking of expired) {
      const seatKey = booking.seat_class.toUpperCase();
      const releasedSeats = booking.passengers.length;

      const flight = await Flight.findById(booking.flight);
      if (flight && flight.seat[booking.seat_class.toLowerCase()] !== undefined) {
        flight.seat[booking.seat_class.toLowerCase()] += releasedSeats;
        await flight.save();

        if (seatRecoveryLog[seatKey] !== undefined) {
          seatRecoveryLog[seatKey] += releasedSeats;
        }
      }

      booking.payment_status = "cancelled";
      booking.deleted = true;
      await booking.save();

      releasedCount++;
    }

    console.log(`[Timeout Job] Released ${releasedCount} expired bookings.`);
    console.log(`[Seat Recovery Log] ECONOMY: ${seatRecoveryLog.ECONOMY}, PREMIUM: ${seatRecoveryLog.PREMIUM}`);
  } catch (err) {
    console.error("[Timeout Job] Error releasing expired bookings:", err);
  }
};

module.exports = releaseExpiredBookings;