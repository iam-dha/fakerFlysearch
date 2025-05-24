const Hotel = require("../../models/hotel.model");
const Room = require("../../models/room.model");

// [GET] /api/v1/admin/hotels?page=1&limit=10&sort=createdAt&order=desc
exports.getAllHotels = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
        parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc" } = req.query;
    const sortFields = ["createdAt", "updatedAt", "iata", "stars", "name"];
    const sortFilter = sortFields.includes(filter) ? filter : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;
    try {
        const hotels = await Hotel.find({ deleted: false })
            .skip(skip)
            .limit(limit)
            .sort({ [sortFilter]: sortOrder })
            .select("-__v")
            .lean();
        const totalHotels = await Hotel.countDocuments({ deleted: false });
        const totalPages = Math.ceil(totalHotels / limit);
        const hotelData = await Promise.all(
            hotels.map(async (hotel) => {
                hotel.rooms = await Room.find({
                    hotel: hotel._id,
                    deleted: false,
                })
                    .select("-__v")
                    .lean();
                return hotel;
            })
        );
        return res.status(200).json({
            message: "Get all hotels successfully",
            page,
            limit,
            totalPages,
            data: hotelData,
        });
    } catch (error) {
        console.error("[GET /api/v1/admin/hotels] Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [POST] /api/v1/admin/hotels
exports.createHotel = async (req, res) => {
    try {
        const {
            name,
            address,
            stars,
            iata,
            phone,
            email,
            contact_email,
            description,
            thumbnail,
        } = req.body;
        const newHotel = new Hotel({
            name,
            address,
            stars,
            iata,
            phone,
            email,
            contact_email,
            description,
            thumbnail,
        });
        await newHotel.save();
        return res.status(201).json({
            message: "Hotel created successfully",
            data: newHotel,
        });
    } catch (error) {
        console.error("[POST /api/v1/admin/hotels] Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [POST] /api/v1/admin/hotels/:id/rooms
exports.createHotelRoom = async (req, res) => {
    const hotelId = req.params.id;
    const {
        type,
        price,
        available_rooms,
        max_guests,
        description = "",
        thumbnail = "",
    } = req.body;
    const photos = req.photoURLs || [];
    try {
        const hotel = await Hotel.findOne({
            _id: hotelId,
            deleted: false,
        });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const newRoom = new Room({
            hotel: hotelId,
            type,
            price,
            available_rooms,
            max_guests,
            description,
            thumbnail,
            photos,
        });
        await newRoom.save();
        return res.status(201).json({
            message: "Room created successfully",
            data: newRoom,
        });
    } catch (error) {
        console.error("[POST /api/v1/admin/hotels/:id/rooms] Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/admin/hotels/:id
exports.getHotelById = async (req, res) => {
    const hotelId = req.params.id;
    try {
        const hotel = await Hotel.findOne({
            _id: hotelId,
            deleted: false,
        });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const rooms = await Room.find({
            hotel: hotelId,
            deleted: false,
        }).select("-__v");
        return res.status(200).json({
            message: "Get hotel successfully",
            data: {
                hotel,
                rooms,
            },
        });
    } catch (error) {
        console.error("[GET /api/v1/admin/hotels/:id] Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/admin/hotels/rooms/:id
exports.getHotelRoom = async (req, res) => {
    const roomId = req.params.id;
    try {
        const room = await Room.findOne({
            _id: roomId,
            deleted: false,
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        return res.status(200).json({
            message: "Get room successfully",
            data: room,
        });
    } catch (error) {
        console.error("[GET /api/v1/admin/hotels/rooms/:id] Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/admin/hotels/:id
exports.updateHotel = async (req, res) => {
    const hotelId = req.params.id;
    try {
        const hotel = await Hotel.findOne({
            _id: hotelId,
            deleted: false,
        });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const {
            name,
            address,
            stars,
            iata,
            phone,
            email,
            contact_email,
            description,
            thumbnail,
            removeThumbnail = false,
        } = req.body;
        hotel.name = name ?? hotel.name;
        hotel.address = address ?? hotel.address;
        hotel.stars = stars ?? hotel.stars;
        hotel.iata = iata ?? hotel.iata;
        hotel.phone = phone ?? hotel.phone;
        hotel.email = email ?? hotel.email;
        hotel.contact_email = contact_email ?? hotel.contact_email;
        hotel.description = description ?? hotel.description;

        if (removeThumbnail === true || removeThumbnail === "true") {
            hotel.thumbnail = "";
        } else if (typeof thumbnail === "string" && thumbnail.trim() !== "") {
            hotel.thumbnail = thumbnail;
        }
        await hotel.save();
        return res.status(200).json({
            message: "Hotel updated successfully",
            data: hotel,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/admin/hotels/rooms/:id
exports.updateHotelRoom = async (req, res) => {
    const roomId = req.params.id;
    try {
        const room = await Room.findOne({
            _id: roomId,
            deleted: false,
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const {
            type,
            price,
            available_rooms,
            max_guests,
            description = "",
            thumbnail = "",
            removeThumbnail = false,
        } = req.body;
        const photos = req.photoURLs || [];
        room.type = type ?? room.type;
        room.price = price ?? room.price;
        room.available_rooms = available_rooms ?? room.available_rooms;
        room.max_guests = max_guests ?? room.max_guests;
        room.description = description ?? room.description;
        if (removeThumbnail === true || removeThumbnail === "true") {
            room.thumbnail = "";
        } else if (typeof thumbnail === "string" && thumbnail.trim() !== "") {
            room.thumbnail = thumbnail;
        }
        room.photos = photos.length > 0 ? photos : room.photos;
        await room.save();
        return res.status(200).json({
            message: "Room updated successfully",
            data: room,
        });
    } catch (err) {
        console.error("[PATCH /api/v1/admin/hotels/rooms/:id] Error: ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [DELETE] /api/v1/admin/hotels/rooms/:id
exports.deleteHotelRoom = async (req, res) => {
    const roomId = req.params.id;
    try {
        const room = await Room.findOne({
            _id: roomId,
            deleted: false,
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        room.deleted = true;
        await room.save();
        return res.status(200).json({
            message: "Room deleted successfully",
            data: room,
        });
    } catch (err) {
        console.error("[DELETE /api/v1/admin/hotels/rooms/:id] Error: ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// [DELETE] /api/v1/admin/hotels/:id
exports.deleteHotel = async (req, res) => {
    const hotelId = req.params.id;
    try {
      const hotel = await Hotel.findOne({
        _id: hotelId,
        deleted: false,
      });
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      const rooms = await Room.find({
        hotel: hotelId,
        deleted: false,
      });
      if (rooms.length > 0) {
        await Room.updateMany(
          { hotel: hotelId, deleted: false },
          { deleted: true }
        );
      }
      hotel.deleted = true;
      await hotel.save();
      return res.status(200).json({
        message: "Hotel deleted successfully",
        data: hotel,
      });
    } catch (error) {
      
    }
};
