const { BusRoute, BusCompany } = require("../../models/busCompany.model");

// [GET] /api/v1/admin/bus-routes
exports.getAll = async (req, res) => {
    try {
        const routes = await BusRoute.find({ deleted: false }).populate(
            "company"
        );
        res.status(200).json({ message: "OK", data: routes });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// [POST] /api/v1/admin/bus-routes/:companyId
exports.create = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const isExists = await BusCompany.findById(companyId);
        if (!isExists || isExists.deleted) {
            return res.status(404).json({ message: "Company not found" });
        }
        req.body.company = companyId;
        const newRoute = new BusRoute(req.body);
        await newRoute.save();
        res.status(201).json({ message: "Created", data: newRoute });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/admin/bus-routes/:id
exports.getById = async (req, res) => {
    try {
        const route = await BusRoute.findById(req.params.id).populate(
            "company"
        );
        if (!route || route.deleted)
            return res.status(404).json({ message: "Not found" });
        res.status(200).json({ message: "OK", data: route });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/admin/bus-routes/:id
exports.update = async (req, res) => {
    try {
        const deleteLogo = req.body.deleteLogo;
        if (deleteLogo) {
            req.body.logo = "";
        }
        const updated = await BusRoute.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
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
