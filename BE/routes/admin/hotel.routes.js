const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/hotel.controller");

router.get("/", controller.getAllHotels);
router.post("/", controller.createHotel);
router.patch("/:id", controller.updateHotel);
router.delete("/:id", controller.deleteHotel);

module.exports = router;