const BusRoute = require("../../models/busCompany.model");

exports.getAll = async (req, res) => {
  try {
    const routes = await BusRoute.find({ deleted: false }).populate("company");
    res.status(200).json({ message: "OK", data: routes });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const newRoute = new BusRoute(req.body);
    await newRoute.save();
    res.status(201).json({ message: "Created", data: newRoute });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const route = await BusRoute.findById(req.params.id).populate("company");
    if (!route || route.deleted)
      return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "OK", data: route });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await BusRoute.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated || updated.deleted)
      return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const route = await BusRoute.findById(req.params.id);
    if (!route || route.deleted)
      return res.status(404).json({ message: "Not found" });
    route.deleted = true;
    await route.save();
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
