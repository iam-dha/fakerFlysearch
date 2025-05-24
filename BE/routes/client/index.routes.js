const systemConfig = require("../../config/system");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const flightRoute = require("./flight.routes");
const hotelRoute = require("./hotel.routes");
const carRoute = require("./car.routes");
const bookingRoute = require("./booking.routes");
module.exports = (app) => {
  app.use(`${systemConfig.apiPath}/v1/auth`, authRoute);
  app.use(`${systemConfig.apiPath}/v1/user`, userRoute);
  app.use(`${systemConfig.apiPath}/v1/flights`, flightRoute);
  app.use(`${systemConfig.apiPath}/v1/hotels`, hotelRoute);
  app.use(`${systemConfig.apiPath}/v1/cars`, carRoute);
  app.use(`${systemConfig.apiPath}/v1/bookings`, bookingRoute);
};