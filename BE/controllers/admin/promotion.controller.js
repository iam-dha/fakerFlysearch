//Model
const Promotion = require("../../models/promotion.model");

// [GET] /api/v1/admin/promotions?limit=x&page=y&filter=createAt&order=asc
module.exports.getAllPromotions = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
        parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const { filter = "createdAt", order = "asc" } = req.query;
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
    try {
        const promotions = await Promotion.find({
            deleted: false,
        })
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .sort({ [sortFilter]: sortOrder });
        const promotionsCount = await Promotion.countDocuments({
            deleted: false,
        });
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
