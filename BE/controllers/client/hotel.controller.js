const Room = require("../../models/room.model");
const Hotel = require("../../models/hotel.model");
const HotelBooking = require("../../models/hotelBooking.model");
const User = require("../../models/user.model");
const mailer = require("../../services/mailer.service");

exports.bookMultipleRooms = async (req, res) => {
  const { userId, hotelId, rooms, check_in, check_out } = req.body;

  if (!userId || !hotelId || !Array.isArray(rooms) || rooms.length === 0 || !check_in || !check_out) {
    return res.status(400).json({ message: "Missing or invalid fields" });
  }

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel || hotel.deleted) return res.status(404).json({ message: "Hotel not found" });

    let totalPrice = 0;
    const bookingRooms = [];

    for (const r of rooms) {
      const room = await Room.findById(r.room);
      if (!room || room.deleted) return res.status(404).json({ message: `Room not found: ${r.room}` });

      if (room.available_rooms < r.quantity) {
        return res.status(400).json({ message: `Not enough rooms for type: ${room.type}` });
      }

      const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
      totalPrice += room.price * r.quantity * nights;

      bookingRooms.push({ room: room._id, quantity: r.quantity });

      room.available_rooms -= r.quantity;
      await room.save();
    }

    const booking = new HotelBooking({
      user: userId,
      hotel: hotel._id,
      rooms: bookingRooms,
      check_in,
      check_out,
      total_price: totalPrice,
      payment_status: "pending"
    });

    await booking.save();

    const user = await User.findById(userId);
    if (user?.email) {
      await mailer.sendHotelBookingConfirmation(user.email, booking, hotel);
    }

    return res.status(201).json({ message: "Booking successful", data: booking });
  } catch (err) {
    console.error("[POST /hotel-bookings] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRoomsByIataAndDate = async (req, res) => {
  const { iata, check_in, check_out } = req.query;
  if (!iata || !check_in || !check_out) {
    return res.status(400).json({ message: "Missing iata or date range" });
  }

  try {
    const hotels = await Hotel.find({ iata: iata.toUpperCase(), deleted: false });
    const hotelIds = hotels.map(h => h._id);

    const rooms = await Room.find({ hotel: { $in: hotelIds }, deleted: false });

    return res.status(200).json({ message: "OK", data: rooms });
  } catch (err) {
    console.error("[GET /hotel-rooms] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getHotelList = async (req, res) => {
  const { iata } = req.query;
  try {
    const query = { deleted: false };
    if (iata) query.iata = iata.toUpperCase();

    const hotels = await Hotel.find(query).select("name address thumbnail iata");
    return res.status(200).json({ message: "OK", data: hotels });
  } catch (err) {
    console.error("[GET /hotels] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};