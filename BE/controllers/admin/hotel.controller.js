const Hotel = require("../../models/hotel.model");

exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ deleted: false });
    return res.status(200).json({ message: "OK", data: hotels });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createHotel = async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    return res.status(201).json({ message: "Hotel created", data: newHotel });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    return res.status(200).json({ message: "Hotel updated", data: hotel });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    hotel.deleted = true;
    await hotel.save();
    return res.status(200).json({ message: "Hotel soft-deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
