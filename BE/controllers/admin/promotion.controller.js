//Model
const Promotion = require("../../models/promotion.model");

// [GET] /api/v1/admin/promotions?limit=x&page=y&filter=createAt&order=asc&keyword=ZLP&nowActive=true
module.exports.getAllPromotions = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc", keyword = "", nowActive } = req.query;

    const sortFields = [
        "createdAt",
        "deleted",
        "startDate",
        "endDate",
        "totalSlot",
        "discountValue",
        "isActive",
        "isIncluded",
    ];
    const sortFilter = sortFields.includes(filter) ? filter : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const query = { deleted: false };

    if (keyword) {
        const regex = new RegExp(keyword, "i");
        query.$or = [
            { label: regex },
            { code: regex },
            { slug: regex }
        ];
    }

    if (nowActive === "true") {
        const now = new Date();
        query.startDate = { $lte: now };
        query.endDate = { $gte: now };
    }

    try {
        const promotions = await Promotion.find(query)
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .sort({ [sortFilter]: sortOrder });

        const promotionsCount = await Promotion.countDocuments(query);

        return res.status(200).json({
            message: "Get promotions successfully",
            data: {
                totalCount: promotionsCount,
                currentPage: page,
                totalPages: Math.ceil(promotionsCount / limit),
                promotions: promotions,
            },
        });
    } catch (error) {
        console.error(`[GET /api/v1/admin/promotions] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [POST] /api/v1/admin/promotions
module.exports.createPromotion = async (req, res) => {
    try {
        const newPromotion = new Promotion(req.body);
        await newPromotion.save();
        res.status(201).json({ message: "Promotion created successfully", promotion: newPromotion });
    } catch (error) {
        console.error(`[POST /api/v1/admin/promotions] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/admin/promotions/:id
module.exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion || promotion.deleted) {
            return res.status(404).json({ message: "Promotion not found" });
        }
        res.status(200).json({ message: "Promotion retrieved", promotion });
    } catch (error) {
        console.error(`[GET /api/v1/admin/promotions/:id] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/admin/promotions/:id
module.exports.updatePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!promotion || promotion.deleted) {
            return res.status(404).json({ message: "Promotion not found" });
        }
        res.status(200).json({ message: "Promotion updated", promotion });
    } catch (error) {
        console.error(`[PATCH /api/v1/admin/promotions/:id] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [DELETE] /api/v1/admin/promotions/:id
module.exports.deletePromotion = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id);
        if (!promotion || promotion.deleted) {
            return res.status(404).json({ message: "Promotion not found" });
        }
        promotion.deleted = true;
        promotion.deletedAt = new Date();
        await promotion.save();
        res.status(200).json({ message: "Promotion deleted successfully" });
    } catch (error) {
        console.error(`[DELETE /api/v1/admin/promotions/:id] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};