//Model
const Promotion = require("../../models/promotion.model");

// [GET] /api/v1/admin/promotions?limit=x&page=y&filter=createAt&order=asc&keyword=ZLP&nowActive=true
module.exports.getAllPromotions = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit =
        parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const {
        filter = "createdAt",
        order = "asc",
        keyword = "",
        nowActive,
    } = req.query;

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
        query.$or = [{ label: regex }, { code: regex }, { slug: regex }];
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
    const {
        label,
        description = "",
        code,
        thumbnail = "",
        startDate = new Date(Date.now()),
        endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalSlot = 0,
        isIncluded = false,
        isActive = true,
        discountValue,
    } = req.body;
    try {
        const isExistPromotion = await Promotion.findOne({
            code: code,
            deleted: false,
        });
        if (isExistPromotion) {
            return res.status(400).json({
                message: "Promotion code already exists",
            });
        }
        const newPromotion = new Promotion({
            label,
            description,
            code,
            thumbnail,
            startDate,
            endDate,
            totalSlot,
            isIncluded,
            isActive,
            discountValue,
        });
        await newPromotion.save();
        const promotionObj = newPromotion.toObject();
        delete promotionObj.__v;
        delete promotionObj._id;
        return res.status(201).json({
            message: "Create promotion successfully",
            data: promotionObj,
        });
    } catch (error) {
        console.error(`[POST /api/v1/admin/promotions] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [GET] /api/v1/admin/promotions/:slug
module.exports.getPromotionBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const promotion = await Promotion.findOne({
            slug: slug,
            deleted: false,
        }).select("-__v");
        if (!promotion) {
            return res.status(404).json({ message: "Promotion not found" });
        }
        return res.status(200).json({
            message: "Get promotion successfully",
            data: promotion,
        });
    } catch (error) {
        console.error(`[GET /api/v1/admin/promotions/${slug}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [PATCH] /api/v1/admin/promotions/:slug
module.exports.updatePromotion = async (req, res) => {
    const { slug } = req.params;
    const {
        label,
        description,
        code,
        thumbnail,
        startDate = new Date(Date.now()),
        endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalSlot = 0,
        isIncluded = false,
        isActive = true,
        discountValue,
    } = req.body;
    try {
        const promotion = await Promotion.findOne({
            slug: slug,
            deleted: false,
        });
        if (!promotion) {
            return res.status(404).json({ message: "Promotion not found" });
        }
        const isExistPromotion = await Promotion.findOne({
            code: code,
            deleted: false,
            _id: { $ne: promotion._id },
        });
        if (isExistPromotion) {
            return res.status(400).json({
                message: "Promotion code already exists",
            });
        }
        if(label !== undefined){
            promotion.label = label;
        }
        if(description !== undefined){
            promotion.description = description;
        }
        if(code !== undefined){
            promotion.code = code;
        }
        if(thumbnail !== undefined){
            promotion.thumbnail = thumbnail;
        }
        promotion.startDate = startDate;
        promotion.endDate = endDate;
        promotion.totalSlot = totalSlot;
        promotion.isIncluded = isIncluded;
        promotion.isActive = isActive;
        promotion.discountValue = discountValue;
        await promotion.save();
        const promotionObj = promotion.toObject();
        delete promotionObj.__v;
        delete promotionObj._id;
        return res.status(200).json({
            message: "Update promotion successfully",
            data: promotionObj,
        });
    } catch (error) {
        console.error(`[PATCH /api/v1/admin/promotions/${slug}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// [DELETE] /api/v1/admin/promotions/:slug
module.exports.deletePromotion = async (req, res) => {
    const { slug } = req.params;
    try {
        const promotion = await Promotion.findOne({
            slug: slug,
            deleted: false,
        });
        if (!promotion) {
            return res.status(404).json({ message: "Promotion not found" });
        }
        promotion.deleted = true;
        await promotion.save();
        return res.status(200).json({
            message: "Delete promotion successfully",
        });
    } catch (error) {
        console.error(`[DELETE /api/v1/admin/promotions/${slug}] Error:`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
