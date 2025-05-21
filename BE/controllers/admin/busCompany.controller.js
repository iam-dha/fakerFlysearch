const BusCompany = require("../../models/busCompany.model");

exports.getAll = async (req, res) => {
  try {
    const companies = await BusCompany.find({ deleted: false });
    res.status(200).json({ message: "OK", data: companies });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const newCompany = new BusCompany(req.body);
    await newCompany.save();
    res.status(201).json({ message: "Created", data: newCompany });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const company = await BusCompany.findById(req.params.id);
    if (!company || company.deleted)
      return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "OK", data: company });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await BusCompany.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated || updated.deleted)
      return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const company = await BusCompany.findById(req.params.id);
    if (!company || company.deleted)
      return res.status(404).json({ message: "Not found" });
    company.deleted = true;
    await company.save();
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
