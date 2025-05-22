const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/booking.controller");
const authMiddleware = require("../../middlewares/authenticate.middleware");

router.use(authMiddleware.checkAccessToken("Admin"));
router.get("/", controller.getAllBookings);
router.get("/:bookingId", controller.getBookingDetail);
router.patch("/:bookingId/status", controller.updateBookingStatus);

module.exports = router;