const express = require('express');
const controller = require('../../controllers/admin/hotel.controller');



const router = express.Router();

router.get("/", controller.getAllHotels);


module.exports = router;