const Room = require("../../models/room.model");

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ deleted: false }).populate("hotel");
    return res.status(200).json({ message: "OK", data: rooms });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createRoom = async (req, res) => {
  try {
    if (req.uploadedImages) {
      req.body.thumbnails = req.uploadedImages; 
    }
    const newRoom = new Room(req.body);
    await newRoom.save();
    return res.status(201).json({ message: "Room created", data: newRoom });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (req.uploadedImages) {
      req.body.thumbnails = req.uploadedImages;
    }

    Object.assign(room, req.body);
    await room.save();

    return res.status(200).json({ message: "Room updated", data: room });
  } catch (err) {
    console.error("Update room error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    room.deleted = true;
    await room.save();
    return res.status(200).json({ message: "Room soft-deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

