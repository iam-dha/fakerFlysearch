const Room = require("../../models/room.model");
const Hotel = require("../../models/hotel.model");
const HotelBooking = require("../../models/hotelBooking.model");
const User = require("../../models/user.model");
const mailer = require("../../services/mailer.service");

exports.bookMultipleRooms = async (req, res) => {
  const userId = req.userId;
  const { hotelId, rooms, check_in, check_out } = req.body;

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

exports.getHotelDetails = async (req, res) => {
  const { hotelId } = req.params;

  if (!hotelId) {
    return res.status(400).json({ message: "Missing hotel ID" });
  }

  try {
    const hotel = await Hotel.findOne({ _id: hotelId, deleted: false }).lean();
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const rooms = await Room.find({ hotel: hotelId, deleted: false }).lean();

    return res.status(200).json({
      message: "Hotel detail fetched successfully",
      data: {
        hotel,
        rooms
      }
    });
  } catch (err) {
    console.error(`[GET /hotels/${hotelId}/detail] Error:`, err);
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

exports.getRoomsByHotelId = async (req, res) => {
  const { hotelId } = req.params;
  const { type, page = 1, limit = 10 } = req.query;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel || hotel.deleted) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const query = { hotel: hotelId, deleted: false };

    if (type && ["standard", "deluxe"].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const rooms = await Room.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments(query);

    return res.status(200).json({
      message: "OK",
      data: rooms,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (err) {
    console.error("[GET /hotels/:hotelId/rooms] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getHotelsByIata = async (req, res) => {
  const { iata } = req.params;

  if (!iata) {
    return res.status(400).json({ message: "Missing IATA code" });
  }

  try {
    const hotels = await Hotel.find({
      iata: iata.toUpperCase(),
      deleted: false
    }).select("name address thumbnail iata");

    if (hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found for this IATA code" });
    }

    return res.status(200).json({
      message: "Hotels found",
      count: hotels.length,
      data: hotels
    });
  } catch (err) {
    console.error(`[GET /hotels/iata/${iata}] Error:`, err);
    return res.status(500).json({ message: "Internal server error" });
  }
};